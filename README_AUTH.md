# Documentação - Sistema de Autenticação

## Visão Geral
Este documento descreve o que precisa ser implementado no backend para que o sistema de login funcione corretamente com a API em `localhost:3001`.

## Estado Atual
- ✅ Frontend implementado com `AuthContext` e página de Login
- ✅ Mock users configurados para testes
- ⚠️ Backend precisa implementar rotas de autenticação

---

## 1. Rotas Necessárias no Backend

### 1.1. POST /auth/login
Autentica um usuário e retorna token JWT.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Administrador",
    "email": "admin@example.com",
    "cpf": "123.456.789-00",
    "phone": "(11) 98765-4321",
    "role": "admin",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

**Response (401):**
```json
{
  "message": "Email ou senha inválidos"
}
```

---

### 1.2. POST /auth/register
Registra um novo usuário (opcional - se permitir auto-registro).

**Request:**
```json
{
  "name": "Novo Usuário",
  "email": "novo@example.com",
  "password": "senha123",
  "cpf": "123.456.789-00",
  "phone": "(11) 98765-4321",
  "role": "afiliado"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid-gerado",
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "role": "afiliado",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Usuário criado com sucesso"
}
```

---

### 1.3. GET /auth/me
Retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid-do-usuario",
  "name": "Administrador",
  "email": "admin@example.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 98765-4321",
  "role": "admin",
  "status": "active"
}
```

**Response (401):**
```json
{
  "message": "Token inválido ou expirado"
}
```

---

### 1.4. POST /auth/refresh
Renova o token JWT (opcional, mas recomendado).

**Request:**
```json
{
  "refreshToken": "refresh-token-aqui"
}
```

**Response (200):**
```json
{
  "token": "novo-token-jwt",
  "expiresIn": 86400
}
```

---

### 1.5. POST /auth/logout
Invalida o token atual (opcional).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 2. Banco de Dados

### 2.1. Tabela `users` (já existe)
A tabela já está criada conforme a rota `/users`. Adicione o campo `password`:

```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL;
```

**Importante:**
- Armazenar senha com **hash bcrypt** (nunca texto puro)
- Exemplo: `bcrypt.hash(password, 10)`

### 2.2. Tabela `refresh_tokens` (opcional)
Para implementar refresh tokens:

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. Implementação Recomendada (Backend)

### 3.1. Dependências Node.js
```bash
npm install jsonwebtoken bcrypt
npm install --save-dev @types/jsonwebtoken @types/bcrypt
```

### 3.2. Exemplo de Controller (NestJS/Express)

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Configuração
const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui';
const JWT_EXPIRES_IN = '24h';

// POST /auth/login
async function login(req, res) {
  const { email, password } = req.body;

  // Buscar usuário no banco
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Verificar status do usuário
  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Usuário inativo' });
  }

  // Gerar token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remover senha do retorno
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    user: userWithoutPassword,
    token,
    expiresIn: 86400 // 24 horas em segundos
  });
}

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

// GET /auth/me
async function getMe(req, res) {
  const userId = req.user.userId;

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      phone: true,
      role: true,
      status: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  return res.status(200).json(user);
}
```

---

## 4. Mudanças Necessárias no Frontend

### 4.1. Atualizar `src/contexts/AuthContext.tsx`

```typescript
// Remover MOCK_USERS e implementar chamadas reais à API

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { user, token } = response.data;
    
    // Armazenar token
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Configurar token no axios
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  delete axiosClient.defaults.headers.common['Authorization'];
  setUser(null);
};

// Verificar token ao carregar
useEffect(() => {
  const token = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('currentUser');
  
  if (token && storedUser) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(JSON.parse(storedUser));
  }
}, []);
```

### 4.2. Atualizar `src/services/api/axiosClient.ts`

```typescript
// Adicionar interceptor para incluir token automaticamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tratar erro 401 (token expirado)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - fazer logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Preenche email e senha
   ↓
3. Frontend envia POST /auth/login
   ↓
4. Backend valida credenciais
   ↓
5. Backend gera JWT token
   ↓
6. Frontend armazena token e user no localStorage
   ↓
7. Frontend configura header Authorization em todas requisições
   ↓
8. Usuário é redirecionado para /cupons
   ↓
9. Todas as requisições incluem: Authorization: Bearer <token>
   ↓
10. Backend valida token em cada requisição protegida
```

---

## 6. Segurança

### ✅ Checklist de Segurança

- [ ] Senhas armazenadas com bcrypt (nunca texto puro)
- [ ] Token JWT com tempo de expiração (24h recomendado)
- [ ] Secret do JWT armazenado em variável de ambiente
- [ ] HTTPS em produção (nunca HTTP)
- [ ] Validação de entrada (email válido, senha forte)
- [ ] Rate limiting no endpoint de login (prevenir brute force)
- [ ] Logout invalida token no backend (se usando lista de tokens)
- [ ] Renovação de token antes de expirar (refresh token)

---

## 7. Usuários de Teste

Para facilitar os testes, crie estes usuários no banco:

```sql
INSERT INTO users (name, email, password, cpf, phone, role, status) VALUES
  ('Administrador', 'admin@example.com', '$2b$10$hash...', '123.456.789-00', '(11) 98765-4321', 'admin', 'active'),
  ('Afiliado Teste', 'afiliado@example.com', '$2b$10$hash...', '987.654.321-00', '(11) 91234-5678', 'afiliado', 'active'),
  ('Polo Teste', 'polo@example.com', '$2b$10$hash...', '456.789.123-00', '(11) 94567-8901', 'polo', 'active');
```

**Senhas (exemplo):**
- Todos: `senha123`
- Hash bcrypt: `await bcrypt.hash('senha123', 10)`

---

## 8. Testes

### 8.1. Testar Login (cURL)
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123"}'
```

### 8.2. Testar Rota Protegida
```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 9. Variáveis de Ambiente (.env)

```env
# Backend
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-chars
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Frontend (.env na raiz do projeto React)
VITE_API_BASE_URL=http://localhost:3001
```

---

## 10. Próximos Passos

1. ✅ Implementar rotas `/auth/login`, `/auth/me` no backend
2. ✅ Adicionar campo `password` na tabela `users`
3. ✅ Criar usuários de teste com senhas hash
4. ✅ Atualizar `AuthContext.tsx` para usar API real
5. ✅ Atualizar `axiosClient.ts` com interceptors
6. ✅ Testar fluxo completo de login/logout
7. ⚠️ Implementar refresh token (opcional)
8. ⚠️ Adicionar validação de força de senha
9. ⚠️ Implementar "Esqueci minha senha"

---

## 11. Troubleshooting

### Erro: "Token inválido ou expirado"
- Verificar se JWT_SECRET é o mesmo no backend
- Verificar se token não expirou (padrão 24h)
- Limpar localStorage e fazer login novamente

### Erro: "Email ou senha inválidos"
- Verificar se usuário existe no banco
- Verificar se senha foi hasheada corretamente
- Testar com bcrypt.compare() no backend

### Erro: CORS
- Adicionar middleware CORS no backend:
```typescript
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true
}));
```

---

## Contato

Para dúvidas, consulte:
- README_API.md (documentação da API REST)
- Código atual em `src/contexts/AuthContext.tsx`
- Código atual em `src/services/api/axiosClient.ts`
