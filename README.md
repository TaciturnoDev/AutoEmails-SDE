Projeto criado e utilizado para envio em larga escala para mais de 20 mil usuários.
O Projeto AutoEmails foi desenvolvido para automatizar o processo de cobrança administrativa em larga escala de beneficiárias de programas públicos,
substituindo um processo manual por uma plataforma capaz de processar listas de beneficiários, gerar mensagens personalizadas em HTML, controlar filas de envio,
registrar logs completos e acompanhar toda a operação em tempo real através de dashboards.

IMPACTO
A solução foi utilizada para envio automatizado de comunicação para mais de 20 mil beneficiárias, padronizando o processo de cobrança, que anteriormente era feito 
por mais de 10 estagiários manualmente, e estava em atraso a mais de 2 anos. e ajudando a recuperar alguns milhões de reais aos cofres públicos.

TECNOLOGIA
JavaScript, HTML, CSS, JSON, Sistemas de Templates HTML, Sistema de filas, Sistema de logs, Dashboard em tempo real.

FUNCIONALIDADES
importação e tradução dos dados recebidos, Processamento automático dos beneficiários, Agrupamento por CPF, Cálculo automático de quantidade de parcelas,
Geração dinâmica de e-mails personalizados, Templates HTML, Controle de fila, Intervalo aleatório entre envios, Dashboard em tempo real para acompanhamento e análise
Registros completo de dados com logs, Acompanhamento da operação completa.

Desafios Técnicos
Durante o desenvolvimento foi necessário estudar, projetar mecanismos para evitar bloqueios do servidor SMTP, controlar fluxo de envio em larga escala,
personalizar milhares de mensagens individualmente e acompanhar toda a execução em tempo real sem comprometer a estabilidade da aplicação. 
além do curto tempo que tive entre identificar o gargalo operacional e realizar o projeto, pois era de extrema urgência. 

Transformação do fluxo operacional
Tive de aprender do zero a transformar ( Nome, Email, CPF, CPF repetido... CPF repetido...)
em (Cliente --> Quantidade de parcelas individuais --> Template HTML --> Fila de envio --> Log --> Dashboard)
em um curto período de tempo.

<img width="1600" height="792" alt="image" src="https://github.com/user-attachments/assets/fd09d788-0a8d-4d53-befd-90ba639fade8" />
<img width="1597" height="785" alt="image" src="https://github.com/user-attachments/assets/01d05552-c55b-4549-9c9d-f0b7f30b513b" />
<img width="1597" height="792" alt="image" src="https://github.com/user-attachments/assets/e3f0f98f-60f2-4dd7-872e-6be0de71d0ce" />
<img width="1581" height="997" alt="image" src="https://github.com/user-attachments/assets/bfa391d2-6caa-4939-84b1-cb505efbd3ff" />
<img width="1423" height="357" alt="image" src="https://github.com/user-attachments/assets/6bbaee7d-0009-417a-a89b-2bbfa95abfef" />
<img width="804" height="1600" alt="image" src="https://github.com/user-attachments/assets/68062ce3-3a3f-4dfe-baea-c68ce6a76c36" />



