# 🛠️ Sistema de Chamados Técnicos

[![GitHub license](https://img.shields.io/github/license/seu-usuario/sistema-de-chamados)](LICENSE)  
![React](https://img.shields.io/badge/frontend-React-blue)  
![Firebase](https://img.shields.io/badge/backend-Firebase-orange)  
![Styled Components](https://img.shields.io/badge/styling-styled--components-pink)  
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)  
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> Aplicação web para registro, acompanhamento e gestão de chamados técnicos internos. Projetada para oferecer rastreabilidade, organização e geração de relatórios automatizados com foco na eficiência operacional.

---

## 📑 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📦 Instalação](#-instalação)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔐 Regras de Segurança (Firestore)](#-regras-de-segurança-firestore)
- [🗺️ Roadmap](#-roadmap)
- [📄 Licença](#-licença)
- [📬 Contato](#-contato)

---

## ✨ Funcionalidades

- ✅ Registro de chamados com campos personalizáveis (setor, descrição, data, responsável)  
- ✅ Alteração de status com seletor dinâmico (`Aberto`, `Em andamento`, `Fechado`, etc.)  
- ✅ Histórico de alterações com registro automático (status, responsável, data)  
- ✅ Geração de relatórios em PDF com os dados completos do chamado  
- ✅ Filtros por setor, usuário, status e período  
- ✅ Interface moderna, responsiva e adaptável a diferentes tamanhos de tela  
- ✅ Autenticação de usuários via Firebase Authentication (opcional)  
- ✅ Regras de segurança e controle de acesso com base no usuário  

---

## 🚀 Tecnologias Utilizadas

| Tecnologia            | Finalidade                       |
|------------------------|----------------------------------|
| **React**              | Front-end responsivo             |
| **Styled-Components**  | Estilização em CSS-in-JS         |
| **Firebase Firestore** | Banco de dados em tempo real     |
| **Firebase Auth**      | Autenticação de usuários         |
| **html2pdf.js**        | Exportação de chamados em PDF    |
| **Vite**               | Empacotador e ambiente dev       |

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-de-chamados.git

# Acesse o diretório
cd sistema-de-chamados

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Preencha o arquivo .env com as credenciais do Firebase

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── StyledTable.js       # Tabela customizada com estilo
│   ├── ModalChamado.js      # Modal com detalhes do chamado
│   └── FormChamado.js       # Formulário para criar/editar chamados
├── pages/
│   ├── ChamadosPage.jsx     # Página principal
│   └── LoginPage.jsx        # Tela de login
├── services/
│   └── firebase.js          # Integração com Firebase
├── utils/
│   └── pdfGenerator.js      # Lógica de geração de PDF
└── App.jsx                  # Componente raiz da aplicação
```

---

## 🔐 Regras de Segurança (Firestore)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Chamados - apenas usuários autenticados
    match /chamados/{chamadoId} {
      allow read, write: if request.auth != null;
    }

    // Usuários - acesso restrito ao próprio documento
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Histórico - somente leitura
    match /historicoStatus/{entryId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## 🗺️ Roadmap

- [x] Geração de PDF do chamado  
- [x] Registro automático do histórico de alterações  
- [x] Componentes estilizados e reutilizáveis  
- [x] Dashboard com métricas e gráficos  
- [x] Notificações automáticas (e-mail ou push)  
- [x] Controle de permissões por tipo de usuário  
- [x] Modo dark/light  

---

## 📄 Licença

Este projeto está licenciado sob os termos da [Licença MIT](LICENSE).

---

## 📬 Contato

**Desenvolvedor responsável:**  
[Jhonathan Lucas]  
