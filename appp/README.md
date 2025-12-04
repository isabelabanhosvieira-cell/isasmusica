# 🎵 App de Música (Tipo Spotify)

Aplicativo completo de streaming de música com funcionalidades avançadas de playlists, podcasts, letras e recomendações baseadas em IA.

## 🚀 Funcionalidades

- ✅ Tela inicial com recomendações personalizadas
- ✅ Sistema de login/cadastro
- ✅ Pesquisa avançada de músicas, álbuns e artistas
- ✅ Player de música completo com letras em tempo real
- ✅ Biblioteca pessoal com playlists
- ✅ Seção de podcasts
- ✅ Perfil de usuário
- ✅ Modo escuro
- ✅ Design responsivo
- ✅ Suporte para 1000+ músicas com lazy loading

## 📁 Estrutura do Projeto

```
appp/
├── frontend/
│   ├── index.html          # Tela inicial
│   ├── login.html          # Login/Cadastro
│   ├── search.html         # Pesquisa
│   ├── player.html         # Player de música
│   ├── album.html          # Página de álbum
│   ├── podcasts.html       # Seção de podcasts
│   ├── library.html        # Biblioteca do usuário
│   ├── profile.html        # Perfil do usuário
│   ├── css/
│   │   └── style.css       # Estilos principais
│   └── js/
│       ├── main.js         # JavaScript principal
│       ├── player.js       # Lógica do player
│       └── api.js          # Comunicação com API
├── backend/
│   ├── server.js           # Servidor Express
│   ├── models/             # Modelos do banco de dados
│   ├── routes/             # Rotas da API
│   └── middleware/         # Middlewares
├── package.json
└── README.md
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### Passos

1. **Clone o repositório** (ou navegue até a pasta do projeto)

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   
   Copie o arquivo `env.example` para `.env`:
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/musicapp
   JWT_SECRET=seu_secret_key_super_seguro_aqui
   ```

4. **Certifique-se de que o MongoDB está rodando:**
   - Se estiver usando MongoDB local, inicie o serviço
   - Se estiver usando MongoDB Atlas, use a string de conexão fornecida

5. **Inicie o servidor:**
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

6. **Acesse o aplicativo:**
   - Abra seu navegador em `http://localhost:3000`
   - Crie uma conta ou faça login
   - Comece a explorar!

## 🎨 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB com Mongoose
- **Autenticação**: JWT (JSON Web Tokens)

## 📝 Funcionalidades Detalhadas

### 🎵 Player de Música
- Reprodução de músicas com controles completos (play, pause, next, previous)
- Barra de progresso interativa
- Modo shuffle (embaralhar)
- Modo repeat (repetir: nenhum, todas, uma)
- Exibição de letras em tempo real
- Controle de volume

### 🔍 Pesquisa
- Busca em tempo real
- Filtros por tipo (músicas, álbuns, artistas, playlists, podcasts)
- Sugestões automáticas
- Busca por letras

### 📚 Biblioteca
- Organize suas músicas favoritas
- Crie e gerencie playlists personalizadas
- Salve álbuns e podcasts
- Histórico de reprodução

### 🎙️ Podcasts
- Explore podcasts por categoria
- Siga seus podcasts favoritos
- Acesse episódios completos

### 👤 Perfil
- Gerencie suas preferências
- Configure notificações
- Visualize estatísticas de uso

## 🎨 Design

- **Modo Escuro/Claro**: Alternância suave entre temas
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações Suaves**: Transições e efeitos visuais modernos
- **Lazy Loading**: Carregamento otimizado para grandes volumes de conteúdo (1000+ músicas)

## 🔐 Segurança

- Autenticação JWT
- Senhas criptografadas com bcrypt
- Middleware de autenticação para rotas protegidas
- Validação de dados no backend

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual

### Músicas
- `GET /api/songs` - Listar músicas (com paginação)
- `GET /api/songs/:id` - Obter música específica
- `GET /api/songs/search?q=query` - Buscar músicas

### Álbuns
- `GET /api/albums` - Listar álbuns
- `GET /api/albums/:id` - Obter álbum específico
- `GET /api/albums/:id/songs` - Obter músicas do álbum

### Playlists
- `GET /api/playlists` - Listar playlists do usuário
- `POST /api/playlists` - Criar nova playlist
- `POST /api/playlists/:id/songs` - Adicionar música à playlist

### Biblioteca
- `GET /api/library` - Obter biblioteca do usuário
- `POST /api/library` - Adicionar item à biblioteca
- `DELETE /api/library/:type/:id` - Remover item da biblioteca

### Busca
- `GET /api/search?q=query&filter=type` - Busca geral

## 🚧 Próximos Passos

Para adicionar músicas ao sistema, você pode:
1. Criar um script de seed para popular o banco de dados
2. Implementar upload de arquivos de áudio
3. Integrar com APIs de música (Spotify, YouTube, etc.)
4. Adicionar mais funcionalidades de IA para recomendações

## 📝 Notas

- O aplicativo suporta lazy loading para otimizar o carregamento de grandes volumes de músicas
- O design é totalmente responsivo e inclui modo escuro
- As letras das músicas são exibidas em tempo real durante a reprodução
- O backend está preparado para escalar e lidar com muitos usuários simultâneos

