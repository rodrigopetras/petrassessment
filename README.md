# Security Assessment - Avaliação de Segurança da Informação

Sistema completo de assessment de segurança da informação baseado nos controles CIS (Center for Internet Security).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login tradicional com email/usuário e senha
- Login social (Google, Microsoft, Facebook)
- Cadastro de novos usuários
- Recuperação de senha
- Usuário administrador pré-cadastrado

### 🏢 Gestão de Empresas
- Cadastro completo de empresa com validação de CNPJ
- Classificação automática por porte (Pequena/Média/Grande)
- Inventário de servidores (Windows/Linux)
- Configuração de ambiente em nuvem

### 📋 Assessment CIS Controls
- **Parte 1**: Informações gerais da infraestrutura
- **Parte 2**: Controles CIS com perguntas filtradas por tamanho da empresa
- Sistema de maturidade com 5 níveis (cores de vermelho a azul)
- Barra de progresso em tempo real
- Exportação de resultados em TXT

### 👤 Painel Administrativo
- Gestão de usuários
- Gestão de perguntas
- Visualização de todos os assessments

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Build**: Vite
- **Ícones**: Lucide React
- **Notificações**: Sonner

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/security-assessment.git

# Entre na pasta
cd security-assessment

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔑 Credenciais Padrão

| Usuário | Senha | Perfil |
|---------|-------|--------|
| rodrigo | Ale@2020 | Administrador |

## 📁 Estrutura do Projeto

```
src/
├── components/ui/    # Componentes shadcn/ui
├── data/            # Dados das perguntas CIS
├── hooks/           # Hooks customizados (auth, assessment)
├── sections/        # Páginas principais
├── types/           # Tipos TypeScript
└── App.tsx          # Componente principal
```

## 🌐 Deploy

A aplicação está configurada para deploy em qualquer plataforma de hospedagem estática:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 📝 Licença

Este projeto é privado e destinado para uso interno.

---

Desenvolvido com ❤️ para avaliação de segurança da informação.
