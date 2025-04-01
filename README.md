# 🛠️ Sistema de Chamados Técnicos - Moderno e Completo

[![GitHub license](https://img.shields.io/github/license/seu-usuario/sistema-de-chamados)](LICENSE)
![React](https://img.shields.io/badge/react-18.3.1-%2361DAFB)
![Firebase](https://img.shields.io/badge/firebase-10.14.1-%23FFCA28)
![Styled Components](https://img.shields.io/badge/styled--components-6.1.15-%23DB7093)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/seu-usuario/sistema-de-chamados/pulls)

> Solução completa para gestão de chamados técnicos com dashboard analítico, exportação de relatórios e controle de acesso granular. Desenvolvido com stack moderna para máxima eficiência operacional.

![Dashboard Preview](.src/assets/painel.png)

## ✨ Funcionalidades Avançadas

### 🎯 Gestão de Chamados
- **Cadastro inteligente** com campos dinâmicos e máscaras de entrada
- **Fluxo de status visual** (Aberto → Em Análise → Em Andamento → Resolvido)
- **Histórico detalhado** com timestamp e responsável por cada alteração
- **Anexos de arquivos** (PDFs, imagens, documentos)
- **Pesquisa avançada** com filtros combinados

### 📊 Business Intelligence
- **Dashboard analítico** com métricas em tempo real
- **Gráficos interativos** (Recharts) de SLA, tempo médio de resolução
- **Indicadores KPI** de eficiência por equipe/técnico
- **Previsão de demanda** com base em histórico

### 📑 Exportação de Dados
- **Gerador de PDF profissional** (jsPDF + AutoTable)
- **Exportação para Excel** (XLSX) com formatação automática
- **Relatórios personalizáveis** com logo da empresa
- **Agendamento de relatórios** periódicos

### 🔐 Segurança e Acessos
- **Autenticação via Firebase** (Email/Senha, Google)
- **Controle de permissões** por nível de usuário
- **Regras de segurança** no Firestore
- **Auditoria de acesso** completo

### 🎨 UX Moderna
- **Interface responsiva** (mobile/desktop)
- **Notificações Toast** para ações importantes
- **Modo claro/escuro** (em desenvolvimento)
- **Componentes reutilizáveis** com Styled Components
- **Acessibilidade** WCAG 2.1 AA

## 🚀 Stack Tecnológica

| Módulo | Tecnologias | Versão | Finalidade |
|--------|------------|--------|------------|
| **Core** | React, React DOM | 18.3.1 | Framework base |
| **Estilo** | Styled Components | 6.1.15 | CSS-in-JS |
| **Backend** | Firebase (Firestore, Auth) | 10.14.1 | Banco de dados e autenticação |
| **Forms** | React Hook Form, Input Mask | 2.0.4 | Validação de formulários |
| **PDF** | jsPDF, AutoTable | 2.5.2 | Geração de relatórios |
| **Excel** | XLSX | 0.18.5 | Exportação para planilhas |
| **Gráficos** | Recharts | 2.13.0 | Visualização de dados |
| **UI** | React Icons, SweetAlert2 | 5.3.0, 11.15.3 | Componentes visuais |
| **Datas** | date-fns | 3.6.0 | Manipulação de datas |
| **Roteamento** | React Router DOM | 6.24.1 | Navegação SPA |
| **Editor** | React Quill | 2.0.0 | Editor de rich text |
| **Notificações** | React Toastify | 10.0.6 | Feedback visual |

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- Yarn 1.22+ (ou npm 8+)
- Conta Firebase

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/sistema-de-chamados.git

# 2. Instale as dependências (recomendado usar Yarn)
yarn install

# 3. Configure o Firebase
cp .env.example .env.local
# Preencha com suas credenciais do Firebase:
VITE_FIREBASE_API_KEY=SUA_CHAVE
VITE_FIREBASE_AUTH_DOMAIN=SEU_DOMINIO
VITE_FIREBASE_PROJECT_ID=SEU_PROJETO
VITE_FIREBASE_STORAGE_BUCKET=SEU_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER
VITE_FIREBASE_APP_ID=SEU_APP_ID

# 4. Inicie o servidor de desenvolvimento
yarn dev

# 5. Acesse no navegador
http://localhost:3000