# API Search App

Uma aplicação React para busca de dados via API com sistema de autenticação. Desenvolvida para demonstrar integração com APIs externas, gerenciamento de estado e navegação entre telas.

## Funcionalidades

### Principais
- Sistema de autenticação com Bearer Token
- Interface de busca com filtros por categoria
- Visualização de resultados em grid responsivo
- Tela de detalhes com navegação inteligente
- Tratamento de erros e estados de loading

### Categorias de Busca
- **Posts**: Busca em títulos e conteúdo
- **Usuários**: Busca em nomes, emails e usernames
- **Álbuns**: Busca em títulos de álbuns
- **Todos**: Busca combinada em todas as categorias

## Tecnologias

- React 18 com TypeScript
- React Router DOM para navegação
- Axios para requisições HTTP
- Context API para gerenciamento de estado
- JSONPlaceholder API como fonte de dados

## Instalação e Execução

### Pré-requisitos
- Node.js 16 ou superior
- npm ou yarn

### Passos

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd fullstack
```

2. Instale as dependências
```bash
npm install
```

3. Execute a aplicação
```bash
npm start
```

4. Acesse no navegador
```
http://localhost:3000
```

## Como Usar

### Busca
1. Digite sua pesquisa na caixa de texto
2. Selecione uma categoria (opcional)
3. Clique em "Buscar" ou pressione Enter
4. Visualize os resultados em cards clicáveis

### Detalhes
1. Clique em qualquer resultado para ver informações completas
2. Use o botão "Voltar" para retornar à lista
3. Os resultados da pesquisa são mantidos ao navegar

## Arquitetura da API

### Estrutura do Serviço
```typescript
// src/services/api.ts
class ApiService {
  // Autenticação automática
  async authenticate(): Promise<string>
  
  // Busca unificada
  async search(query: string, category?: string): Promise<SearchResult[]>
  
  // Busca por categoria específica
  async searchPosts(query: string): Promise<SearchResult[]>
  async searchUsers(query: string): Promise<SearchResult[]>
  async searchAlbums(query: string): Promise<SearchResult[]>
  
  // Detalhes de item específico
  async getItemById(id: string, category: string): Promise<SearchResult | null>
}
```

### Fluxo de Autenticação
1. Primeira requisição verifica se há token válido
2. Se não autenticado, faz login automático
3. Token é adicionado automaticamente em todas as requisições
4. Interceptors tratam renovação e erros de autenticação

### Estrutura de Dados
```typescript
interface SearchResult {
  id: string;
  title: string;
  description: string;
  author?: string;
  publishedAt?: string;
  url?: string;
  category?: string;
}
```

## Configuração da API

### Fonte de Dados
A aplicação usa a JSONPlaceholder API como fonte de dados:
- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Endpoints**: `/posts`, `/users`, `/albums`
- **Autenticação**: Simulada com token mock

### Personalização
Para usar uma API diferente, modifique `src/services/api.ts`:

```typescript
// Altere a baseURL
baseURL: 'https://sua-api.com',

// Implemente autenticação real
async authenticate(): Promise<string> {
  const response = await this.api.post('/auth/login', {
    username: 'seu-usuario',
    password: 'sua-senha'
  });
  return response.data.token;
}
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── SearchList.tsx      # Interface de busca e resultados
│   ├── DetailView.tsx      # Visualização de detalhes
│   └── StatsCard.tsx       # Estatísticas da busca
├── context/
│   └── SearchContext.tsx   # Estado global da aplicação
├── services/
│   └── api.ts             # Serviço de integração com API
├── App.tsx                # Componente principal
└── index.tsx              # Ponto de entrada
```

## Build e Deploy

### Build para Produção
```bash
npm run build
```

### Deploy
A aplicação pode ser deployada em qualquer serviço de hospedagem estática:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## Desenvolvimento

### Scripts Disponíveis
- `npm start` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes
- `npm run eject` - Ejecta configurações do Create React App

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz:
```env
REACT_APP_API_BASE_URL=https://jsonplaceholder.typicode.com
REACT_APP_API_TIMEOUT=10000
```

## Características Técnicas

### Performance
- Busca paralela em múltiplas categorias
- Cache de resultados no contexto
- Lazy loading de componentes
- Otimização de re-renders

### Acessibilidade
- Navegação por teclado
- Suporte a screen readers
- Contraste adequado
- Estados de loading claros

### Responsividade
- Design mobile-first
- Breakpoints adaptativos
- Grid flexível
- Tipografia responsiva

## Licença

Este projeto está sob a licença MIT.