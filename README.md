# 🛠️ Sistema de Chamados Técnicos - Moderno e Completo

[![GitHub license](https://img.shields.io/github/license/seu-usuario/sistema-de-chamados)](LICENSE)
![React](https://img.shields.io/badge/react-18.3.1-%2361DAFB)
![Firebase](https://img.shields.io/badge/firebase-10.14.1-%23FFCA28)
![Styled Components](https://img.shields.io/badge/styled--components-6.1.15-%23DB7093)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/seu-usuario/sistema-de-chamados/pulls)

> Solução completa para gestão de chamados técnicos com dashboard analítico, exportação de relatórios e controle de acesso granular. Desenvolvido com stack moderna para máxima eficiência operacional.

## 📷 Visualização do Painel

### Menu Principal
- **Chamados**
- **Clientes**
- **Usuários**
- **Gráficos**
- **Contratos**
- **Perfil**

### Listagem de Chamados (Exemplo)

| SETOR               | ASSUNTO                 | STATUS    | USUÁRIO                  | CADASTRO              | ENCERRAMENTO        | AÇÕES       |
|---------------------|-------------------------|-----------|--------------------------|-----------------------|---------------------|-------------|
| Direção Geral       | Problema de Impressora  | 27/09/06  | Jovanithan Kazas         | 01/04/2055 16:46     | 01/04/2055 16:47   | ✏️ 👁️ 🗑️ 📋 |
| Recursos Humanos    | Atualização de Software | 27/09/06  | Jovanithan Kazas         | 31/03/2055 13:56     | 31/03/2055 13:56   | ✏️ 👁️ 🗑️ 📋 |
| T1                 | Superior Técnico        | 27/09/06  | Weinery Alves Queiroz    | 31/03/2055 10:18     | 31/03/2055 10:25   | ✏️ 👁️ 🗑️ 📋 |
| Financeiro         | Superior Técnico        | 27/09/06  | Weinery Alves Queiroz    | 31/03/2055 09:24     | 31/03/2055 09:25   | ✏️ 👁️ 🗑️ 📋 |
| Manutenção         | Superior Técnico        | 27/09/06  | —                        | 27/03/2055 10:34     | —                  | ✏️ 👁️ 🗑️ 📋 |

*Legenda de Ações: ✏️ Editar | 👁️ Visualizar | 🗑️ Excluir | 📋 Copiar*

---

## ✨ Funcionalidades Avançadas

### 🎯 Gestão de Chamados
- **Cadastro inteligente** com campos dinâmicos e máscaras de entrada
- **Fluxo de status visual** (Aberto → Em Análise → Em Andamento → Resolvido)
- **Histórico detalhado** com timestamp e responsável por cada alteração
- **Anexos de arquivos** (PDFs, imagens, documentos)

### 📊 Business Intelligence
- **Dashboard analítico** com métricas em tempo real
- **Gráficos interativos** (Recharts) de SLA, tempo médio de resolução
- **Indicadores KPI** de eficiência por equipe/técnico

### 📑 Exportação de Dados
- **Gerador de PDF profissional** (jsPDF + AutoTable)
- **Exportação para Excel** (XLSX) com formatação automática
- **Relatórios personalizáveis** com logo da empresa

### 🔐 Segurança e Acessos
- **Autenticação via Firebase** (Email/Senha, Google)
- **Controle de permissões** por nível de usuário
- **Regras de segurança** no Firestore

### 🎨 UX Moderna
- **Interface responsiva** (mobile/desktop)
- **Notificações Toast** para ações importantes
- **Componentes reutilizáveis** com Styled Components

---

## 🚀 Stack Tecnológica

| Módulo | Tecnologias | Finalidade |
|--------|------------|------------|
| **Frontend** | React 18, Styled Components | Interface do usuário |
| **Backend** | Firebase (Firestore, Auth) | Banco de dados e autenticação |
| **PDF** | jsPDF, AutoTable | Geração de relatórios |
| **Gráficos** | Recharts | Visualização de dados |
| **Utilitários** | date-fns, React Icons | Manipulação de datas e ícones |

---

## 🛠️ Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-de-chamados.git

# Instale as dependências
npm install

# Configure o Firebase
cp .env.example .env
# Preencha com suas credenciais

# Inicie o servidor
npm run dev