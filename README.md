# Backend - Gerenciamento de Escala 12x36

Este projeto backend é parte de um sistema completo para gerenciamento de escala de trabalho no modelo **12x36**, com funcionalidades como cadastro de funcionários, controle de férias, folgas, day off de aniversário, e autenticação via Azure AD.

## 🚀 Tecnologias Utilizadas

- **Node.js 22**
- **Express**
- **MySQL**
- **Azure Active Directory (AD)** para autenticação
- **Docker** (para containerização)
- **Jest** (para testes unitários)

## ⚙️ Funcionalidades Principais

- Cadastro, edição e exclusão de funcionários
- Registro de férias e folgas
- Controle de escalas 12x36
  - Turno 1: 19:00 às 07:00
  - Turno 2: 07:00 às 19:00 (apenas finais de semana e feriados)
- Day off no aniversário do funcionário
- Autenticação com Azure AD
- API RESTful documentada e estruturada

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/marcosaviz/backend.git
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do banco e Azure AD

# Inicie o servidor
npm run dev

#Executar Testes
npm test

#Rodando com Docker

# Build da imagem
docker build -t escala-backend .

# Executar o container
docker run -p 3000:3000 --env-file .env escala-backend


🔐 Autenticação
A autenticação dos usuários é feita por meio do Azure Active Directory. Para configurar:

Crie um aplicativo no portal do Azure AD.

Defina os clientId, tenantId e clientSecret nas variáveis de ambiente.

A aplicação valida tokens de acesso emitidos pelo Azure AD.

📁 Estrutura do Projeto
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── utils/
├── tests/
├── .env.example
├── Dockerfile
└── package.json

📝 Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
