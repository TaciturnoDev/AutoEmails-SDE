const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // ✅ ADICIONADO

const app = express();
const PORT = 3000;

// ✅ CORS LIBERADO
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ SERVIR FRONT CORRETAMENTE (melhor prática)
app.use(express.static(path.join(__dirname, 'public')));

// Upload
const upload = multer({ dest: 'uploads/' });

// 🔹 Limpar arquivos temporários
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  fs.readdirSync(uploadsDir).forEach(file => {
    try {
      fs.unlinkSync(path.join(uploadsDir, file));
    } catch (err) {
      console.error("Erro ao remover arquivo temporário:", file, err.message);
    }
  });
}

// Estado
let filaEmails = [];
let logsEnvio = [];
let enviadosHoje = 0;
let totalEnviados = 0;
const LIMITE_DIARIO = 1400;
let ultimaData = new Date().toDateString();
let intervaloEnvio = null;

// 🔄 Troca de dia
function verificarTrocaDeDia() {
  const hoje = new Date().toDateString();
  if (hoje !== ultimaData) {
    enviadosHoje = 0;
    ultimaData = hoje;
    logsEnvio.unshift({
      nome: "-",
      cpf: "-",
      qtd: "-",
      email: "-",
      status: "🔄 Novo dia, contador resetado",
      hora: new Date().toLocaleTimeString()
    });
    console.log("🔄 Novo dia detectado.");
  }
}

// 📧 SMTP
const transporter = nodemailer.createTransport({
  host: 'smtps.fortaleza.ce.gov.br',
  port: 587,
  secure: false,
  auth: {
    user: '------------------',
    pass: '------------------'
  },
  tls: { rejectUnauthorized: false }
});

// 📊 Processar planilha
async function processarPlanilha(caminhoArquivo) {
  const dados = [];

  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(caminhoArquivo);

  for await (const worksheetReader of workbookReader) {
    let header = [];

    for await (const row of worksheetReader) {
      if (row.number === 1) {
        header = row.values.map(h => (h || '').toString().trim());
        continue;
      }

      const linha = {};
      row.values.forEach((valor, i) => {
        linha[header[i]] = (valor || '').toString().trim();
      });

      dados.push({
        nome: linha["Nome"] || '',
        cpf: (linha["CPF"] || '').replace(/\D/g, ''),
        email: linha["Email"] || '',
        qtd: linha["Qtd"] || 1,
      });
    }
  }

  return dados;
}

// 📧 Enviar email
async function enviarEmail(dados, mensagemModelo) {
  const mensagem = mensagemModelo
    .replace(/{{nome}}/g, dados.nome)
    .replace(/{{cpf}}/g, dados.cpf)
    .replace(/{{qtd}}/g, dados.qtd);

  try {
    await transporter.sendMail({
      from: '"SDE" <fmde@sde.fortaleza.ce.gov.br>',
      to: dados.email,
      bcc: 'fmde@sde.fortaleza.ce.gov.br',
      subject: 'Nossas Guerreiras - Regularização de Parcelas',
      text: mensagem
    });

    enviadosHoje++;
    totalEnviados++;

    console.log(`📧 ${dados.email}`);

    logsEnvio.unshift({
      ...dados,
      status: "✅ Enviado",
      hora: new Date().toLocaleTimeString()
    });

  } catch (err) {
    console.error(`❌ ${dados.email}: ${err.message}`);

    logsEnvio.unshift({
      ...dados,
      status: "❌ Falha",
      hora: new Date().toLocaleTimeString()
    });
  }
}

// 🔁 Processamento
function iniciarProcessamento(mensagem) {
  if (intervaloEnvio) return;

  intervaloEnvio = setInterval(async () => {
    verificarTrocaDeDia();

    if (filaEmails.length === 0) {
      clearInterval(intervaloEnvio);
      intervaloEnvio = null;
      console.log("✅ Fila concluída!");
      return;
    }

    if (enviadosHoje >= LIMITE_DIARIO) {
      console.log("⚠️ Limite diário atingido");
      clearInterval(intervaloEnvio);
      intervaloEnvio = null;
      return;
    }

    const dados = filaEmails.shift();
    await enviarEmail(dados, mensagem);

  }, 5000);
}

// 📥 ROTAS
app.post('/processar', upload.single('planilha'), async (req, res) => {
  try {
    const dados = await processarPlanilha(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json({ sucesso: true, dados });
  } catch {
    res.status(500).json({ erro: 'Erro ao processar planilha' });
  }
});

app.post('/adicionarFila', (req, res) => {
  const lote = req.body;

  if (!Array.isArray(lote)) {
    return res.status(400).json({ erro: "Formato inválido" });
  }

  filaEmails.push(...lote);

  res.json({
    sucesso: true,
    emFila: filaEmails.length
  });
});

app.post('/enviarTodos', (req, res) => {
  const { mensagem } = req.body;

  if (enviadosHoje >= LIMITE_DIARIO) {
    return res.json({ erro: 'Limite atingido' });
  }

  iniciarProcessamento(mensagem);

  res.json({ sucesso: true });
});

app.get('/status', (req, res) => {
  verificarTrocaDeDia();

  res.json({
    enviadosHoje,
    emFila: filaEmails.length,
    limiteDiario: LIMITE_DIARIO,
    totalEnviados
  });
});

// 🚀 START
app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});