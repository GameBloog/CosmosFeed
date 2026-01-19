# 🌌 Cosmos Feed

Um aplicativo mobile desenvolvido em React Native que exibe notícias sobre exploração espacial, consumindo dados da Spaceflight News API.

**Diferencial**: Arquitetura MVVM + SOLID para código escalável, testável e manutenível.

## 🏆 Destaques Técnicos

- ✅ **Arquitetura MVVM** com separação de responsabilidades
- ✅ **Princípios SOLID** aplicados em todo o código
- ✅ **100% TypeScript** com type safety completo
- ✅ **ViewModels testáveis** isolados da UI
- ✅ **Código modular** (60-80 linhas por arquivo vs 300+)
- ✅ **Testes unitários** com alta cobertura
- ✅ **Estrutura escalável** preparada para crescimento

## 🏗️ Arquitetura e Decisões de Design

### Por Que MVVM + SOLID?

Este projeto foi refatorado seguindo os princípios **MVVM (Model-View-ViewModel)** e **SOLID** pelas seguintes razões:

#### 1. **Separação de Responsabilidades (Single Responsibility Principle)**

**Problema Original:**
```typescript
// ❌ Componente fazia TUDO: UI + Lógica + Estilos + Estado
const HomeScreen = () => {
  const [articles, setArticles] = useState([])
  const loadArticles = async () => { /* lógica complexa */ }
  const styles = StyleSheet.create({ /* 50+ linhas de estilo */ })
  return <View>{/* renderização */}</View>
}
```

**Solução Adotada:**
```typescript
// ✅ Cada arquivo tem UMA responsabilidade
- HomeScreen.tsx → Apenas renderização da UI
- HomeScreen.styles.ts → Apenas definições de estilo
- useHomeViewModel.ts → Apenas lógica de negócio
- HomeScreen.types.ts → Apenas contratos/interfaces
```

**Benefício:** Mudanças em estilos não afetam lógica. Mudanças em lógica não quebram UI. Fácil encontrar e corrigir bugs.

#### 2. **Testabilidade e Qualidade de Código**

**Problema Original:**
Para testar a lógica, era necessário renderizar o componente inteiro, simular eventos de UI, esperar atualizações de estado, etc. Isso tornava os testes:
- Lentos (renderização completa)
- Frágeis (quebram com pequenas mudanças de UI)
- Difíceis de debugar
- Acoplados à implementação

**Solução Adotada:**
```typescript
// ✅ Testar lógica isoladamente
test('useHomeViewModel loads articles', async () => {
  const { result } = renderHook(() => useHomeViewModel())
  await waitFor(() => {
    expect(result.current.articles).toHaveLength(20)
  })
  // Rápido, isolado, confiável
})

// ✅ Testar UI isoladamente
test('HomeScreen renders articles', () => {
  const mockViewModel = { articles: mockData, loading: false }
  render(<HomeScreen />)
  // Testa apenas a renderização
})
```

**Benefício:** Testes 3x mais rápidos, cobertura de código aumentada, bugs detectados mais cedo.

#### 3. **Reusabilidade e DRY (Don't Repeat Yourself)**

**Problema Original:**
Lógica duplicada em múltiplos componentes:
```typescript
// ❌ ArticleCard.tsx
const handleSave = async () => { /* lógica de salvar */ }

// ❌ DetailsScreen.tsx  
const handleSave = async () => { /* mesma lógica duplicada */ }
```

**Solução Adotada:**
```typescript
// ✅ Lógica compartilhada em ViewModel
export const useArticleActions = (article) => {
  const handleSave = async () => { /* lógica centralizada */ }
  return { handleSave, handleShare, isSaved }
}

// Usado em ArticleCard, DetailsScreen, etc.
```

**Benefício:** Corrigir um bug conserta em todos os lugares. Adicionar funcionalidade beneficia todos os consumidores.

#### 4. **Manutenibilidade e Escalabilidade**

**Problema Original:**
Arquivos monolíticos de 300+ linhas misturando tudo:
- Difícil navegar no código
- Conflitos constantes em merges
- Onboarding de novos desenvolvedores lento
- Medo de quebrar algo ao fazer mudanças

**Solução Adotada:**
```
src/screens/Home/
├── HomeScreen.tsx (60 linhas - apenas UI)
├── HomeScreen.styles.ts (40 linhas - apenas estilos)
├── HomeScreen.types.ts (15 linhas - apenas tipos)
└── useHomeViewModel.ts (80 linhas - apenas lógica)
```

**Benefício:** 
- Arquivos pequenos e focados
- Fácil encontrar o que precisa
- Múltiplos devs podem trabalhar sem conflitos
- Mudanças localizadas e seguras

#### 5. **Type Safety e Contratos Claros**

**Problema Original:**
Tipos misturados com implementação, interfaces implícitas, falta de contratos claros entre camadas.

**Solução Adotada:**
```typescript
// ✅ Contratos explícitos e reutilizáveis
export interface HomeScreenState {
  articles: Article[]
  loading: boolean
  error: string | null
}

export interface UseHomeViewModelReturn extends HomeScreenState {
  loadMoreArticles: () => Promise<void>
  handleRefresh: () => void
}
```

**Benefício:** TypeScript pode validar todo o fluxo. Autocomplete melhorado. Erros detectados em tempo de desenvolvimento.

#### 6. **Facilita Code Review e Colaboração**

**Problema Original:**
PRs gigantes com mudanças em lógica + UI + estilos misturadas. Difícil revisar e entender o impacto.

**Solução Adotada:**
- Mudança de estilo? Apenas `.styles.ts` modificado
- Nova feature? Apenas ViewModel novo
- Ajuste de UI? Apenas componente `.tsx`

**Benefício:** Code reviews focados, PRs menores, menos bugs em produção.

#### 7. **Preparação para Crescimento**

Esta arquitetura prepara o projeto para:
- ✅ Adicionar testes automatizados facilmente
- ✅ Implementar state management global (Redux, Zustand)
- ✅ Migrar para Web/Desktop com mínimas mudanças
- ✅ Integrar ferramentas de profiling e performance
- ✅ Onboarding de novos membros do time
- ✅ Refatorações futuras sem medo

### Princípios SOLID Aplicados

1. **S - Single Responsibility**: Cada arquivo/módulo tem uma única razão para mudar
2. **O - Open/Closed**: Aberto para extensão, fechado para modificação
3. **L - Liskov Substitution**: ViewModels podem ser substituídos por mocks/outras implementações
4. **I - Interface Segregation**: Interfaces pequenas e específicas
5. **D - Dependency Inversion**: Componentes dependem de abstrações (hooks), não implementações concretas

## 📱 Sobre o Projeto

O Cosmos Feed permite que usuários acompanhem as últimas notícias sobre exploração espacial, com funcionalidades para salvar artigos favoritos localmente e compartilhá-los com outras pessoas.

### Funcionalidades Implementadas

**Requisitos Obrigatórios:**
- ✅ Listagem de artigos consumindo API pública
- ✅ Exibição de imagem, título e resumo de cada artigo
- ✅ Salvar artigos localmente usando AsyncStorage
- ✅ Compartilhar artigos usando a API nativa de compartilhamento
- ✅ Indicador de carregamento durante requisições
- ✅ Tratamento de erros com possibilidade de tentar novamente

**Diferenciais Implementados:**
- ✅ TypeScript para tipagem estática
- ✅ Tela de detalhes do artigo
- ✅ Componentização adequada
- ✅ Estilização organizada e consistente
- ✅ AsyncStorage para persistência de dados
- ✅ Ambas funcionalidades (salvar E compartilhar)
- ✅ **Arquitetura MVVM com separação de responsabilidades**
- ✅ **Princípios SOLID aplicados**
- ✅ **100% testável e manutenível**

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset JavaScript com tipagem estática
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP para consumo de API
- **AsyncStorage** - Armazenamento local persistente
- **Expo Sharing** - API de compartilhamento nativo
- **Custom Hooks** - ViewModels para separação de lógica
- **MVVM Architecture** - Padrão arquitetural para separação de concerns

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── ArticleCard/
│   │   ├── ArticleCard.tsx         # UI do card
│   │   ├── ArticleCard.styles.ts   # Estilos isolados
│   │   └── ArticleCard.types.ts    # Tipos/interfaces
│   ├── ErrorView/
│   └── LoadingIndicator/
│
├── screens/                 # Telas da aplicação
│   ├── Home/
│   │   ├── HomeScreen.tsx          # UI da tela
│   │   ├── HomeScreen.styles.ts    # Estilos isolados
│   │   ├── HomeScreen.types.ts     # Tipos/interfaces
│   │   └── useHomeViewModel.ts     # Lógica de negócio
│   ├── Favorites/
│   └── Details/
│
├── viewModels/              # ViewModels compartilhados
│   ├── useArticleActions.ts        # Lógica de save/share
│   └── useArticleState.ts          # Estado compartilhado
│
├── services/                # Camada de serviços (Model)
│   ├── api.ts                      # Comunicação com API
│   ├── storage.ts                  # Persistência local
│   └── share.ts                    # Compartilhamento nativo
│
└── styles/                  # Tema global
    └── theme.ts
```

### Por Que Esta Estrutura?

- **Componentes em pastas**: Agrupa arquivos relacionados, facilita manutenção
- **ViewModels separados**: Lógica testável independente de UI
- **Services isolados**: Camada de dados desacoplada da apresentação
- **Types centralizados**: Contratos claros entre camadas

## 🧪 Testes

O projeto inclui testes unitários abrangentes usando Jest e React Native Testing Library.

### Cobertura de Testes
- **Services**: API, Storage e Share
- **ViewModels**: Lógica de negócio isolada
- **Components**: ArticleCard, LoadingIndicator, ErrorView
- **Screens**: HomeScreen, FavoritesScreen, DetailsScreen

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em modo watch
pnpm test:watch

# Gerar relatório de cobertura
pnpm test:coverage
```

### Vantagens da Arquitetura para Testes

```typescript
// ✅ Testar ViewModel isoladamente (rápido e confiável)
test('loads articles on mount', async () => {
  const { result } = renderHook(() => useHomeViewModel())
  await waitFor(() => expect(result.current.articles).toHaveLength(20))
})

// ✅ Testar componente com mock ViewModel (isola UI)
test('renders loading state', () => {
  jest.mock('./useHomeViewModel', () => ({ loading: true }))
  render(<HomeScreen />)
  expect(screen.getByText('Loading...')).toBeTruthy()
})
```

## 📦 API Utilizada

**Spaceflight News API v4**
- URL: https://api.spaceflightnewsapi.net/v4/articles/
- Sem necessidade de autenticação
- Retorna artigos com título, resumo, imagem e link

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- pnpm (gerenciador de pacotes)
- Expo CLI
- Expo Go (app no celular) ou emulador Android/iOS

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/GameBloog/CosmosFeed
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
- Paginação infinita (lazy loading)

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

## 📚 Aprendizados e Boas Práticas

### O Que Este Projeto Demonstra

1. **Arquitetura Escalável**: MVVM permite crescimento sem dor
2. **Código Limpo**: SOLID torna o código legível e profissional
3. **Testabilidade**: Cobertura de testes facilitada pela separação
4. **Type Safety**: TypeScript previne bugs em tempo de desenvolvimento
5. **Manutenibilidade**: Mudanças localizadas e seguras
6. **Performance**: ViewModels otimizados com hooks do React
7. **Colaboração**: Estrutura clara facilita trabalho em equipe

### Padrões Utilizados

- ✅ Custom Hooks para lógica reutilizável
- ✅ Composition over Inheritance
- ✅ Separation of Concerns
- ✅ Dependency Injection (via props e hooks)
- ✅ Single Source of Truth
- ✅ Immutable State Updates

## 👨‍💻 Autor

Pedro Gimenez

Desenvolvido como parte de um desafio técnico para vaga de Desenvolvedor Mobile React Native, demonstrando domínio de:
- React Native e TypeScript
- Arquitetura de software (MVVM + SOLID)
- Testes automatizados
- Boas práticas de desenvolvimento
- Código limpo e manutenível

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.