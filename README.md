# 🌌 Cosmos Feed

Um aplicativo mobile desenvolvido em React Native que exibe notícias sobre exploração espacial, consumindo dados da Spaceflight News API.

## 📱 Sobre o Projeto

O Cosmos Feed permite que usuários acompanhem as últimas notícias sobre exploração espacial, com funcionalidades para salvar artigos favoritos localmente e compartilhá-los com outras pessoas.

## 🚀 Funcionalidades Implementadas

### Requisitos Obrigatórios
- ✅ Listagem de artigos consumindo API pública
- ✅ Exibição de imagem, título e resumo de cada artigo
- ✅ Salvar artigos localmente usando AsyncStorage
- ✅ Compartilhar artigos usando a API nativa de compartilhamento
- ✅ Indicador de carregamento durante requisições
- ✅ Tratamento de erros com possibilidade de tentar novamente

### Diferenciais Implementados
- ✅ TypeScript para tipagem estática
- ✅ Tela de detalhes do artigo
- ✅ Componentização adequada
- ✅ Estilização organizada e consistente
- ✅ AsyncStorage para persistência de dados
- ✅ Ambas funcionalidades (salvar E compartilhar)

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset JavaScript com tipagem estática
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP para consumo de API
- **AsyncStorage** - Armazenamento local persistente
- **Expo Sharing** - API de compartilhamento nativo

## 🧪 Testes

O projeto inclui testes unitários abrangentes usando Jest e React Native Testing Library.

### Cobertura de Testes
- **Services**: API, Storage e Share
- **Components**: ArticleCard, LoadingIndicator, ErrorView
- **Screens**: HomeScreen

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em modo watch
pnpm test:watch

# Gerar relatório de cobertura
pnpm test:coverage
```

## 📦 API Utilizada

**Spaceflight News API v4**
- URL: https://api.spaceflightnewsapi.net/v4/articles/
- Sem necessidade de autenticação
- Retorna artigos com título, resumo, imagem e link

## 🏗️ Estrutura do Projeto

```
cosmos-feed/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── ArticleCard.test.tsx
│   │   │   ├── LoadingIndicator.test.tsx
│   │   │   └── ErrorView.test.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── LoadingIndicator.tsx
│   │   └── ErrorView.tsx
│   ├── screens/
│   │   ├── __tests__/
│   │   │   └── HomeScreen.test.tsx
│   │   ├── HomeScreen.tsx
│   │   └── DetailsScreen.tsx
│   ├── services/
│   │   ├── __tests__/
│   │   │   ├── api.test.ts
│   │   │   ├── storage.test.ts
│   │   │   └── share.test.ts
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── share.ts
│   └── styles/
│       └── theme.ts
├── App.tsx
├── app.json
├── jest.config.js
├── package.json
└── tsconfig.json
```

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- pnpm (gerenciador de pacotes)
- Expo CLI
- Expo Go (app no celular) ou emulador Android/iOS

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cosmos-feed.git
cd cosmos-feed
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o projeto:
```bash
pnpm start
```

4. Execute no dispositivo:
- **Android**: Pressione `a` no terminal ou escaneie o QR code com o Expo Go
- **iOS**: Pressione `i` no terminal ou escaneie o QR code com a câmera
- **Web**: Pressione `w` no terminal

## 📱 Funcionalidades Detalhadas

### Tela Principal (Home)
- Lista todos os artigos disponíveis
- Cada card exibe imagem, título e resumo
- Botão para salvar/remover dos favoritos
- Botão para compartilhar o artigo
- Toque no card para ver detalhes completos

### Tela de Detalhes
- Imagem em destaque
- Data de publicação
- Título completo
- Resumo do artigo
- Botões de ação (salvar e compartilhar)
- Botão para ler o artigo completo no site original

### Armazenamento Local
- Artigos salvos persistem mesmo após fechar o app
- Indicador visual mostrando artigos já salvos
- Possibilidade de remover artigos salvos

### Compartilhamento
- Compartilha título, resumo e link do artigo
- Utiliza o menu de compartilhamento nativo do dispositivo

## 🎨 Design

O design segue uma estética espacial minimalista com:
- Paleta de cores escuras inspirada no espaço
- Gradientes sutis
- Ícones simples e intuitivos
- Layout limpo e organizado

## 👨‍💻 Autor

Desenvolvido como parte de um desafio técnico para vaga de Desenvolvedor Mobile React Native.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.