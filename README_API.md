# Documentação da API - Mock e Backend

Esta documentação descreve a estrutura de API criada para o projeto, que funciona tanto com dados mockados quanto com um backend real.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
src/
├── services/api/
│   ├── config.ts           # Configurações da API
│   ├── mockData.ts         # Dados mockados
│   ├── usersService.ts     # Serviço de usuários
│   ├── couponsService.ts   # Serviço de cupons
│   ├── affiliatesService.ts # Serviço de afiliados
│   ├── dashboardService.ts # Serviço do dashboard
│   └── index.ts           # Exportações centralizadas
├── hooks/
│   ├── useApi.ts          # Hook genérico para API
│   ├── useUsers.ts        # Hooks específicos para usuários
│   ├── useCoupons.ts      # Hooks específicos para cupons
│   ├── useAffiliates.ts   # Hooks específicos para afiliados
│   └── useDashboard.ts    # Hooks específicos para dashboard
```

## ⚙️ Configuração

### Alternando entre Mock e Backend Real

No arquivo `src/services/api/config.ts`:

```typescript
export const API_CONFIG = {
  USE_MOCK: true, // Altere para false para usar backend real
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://sua-api-producao.com/api' 
    : 'http://localhost:3001/api',
};
```

### Autenticação

Para adicionar autenticação ao cliente da API:

```typescript
import { apiClient } from '@/services/api';

// Definir token
apiClient.setAuthToken('seu-jwt-token');

// Remover token
apiClient.removeAuthToken();
```

## 📋 Endpoints da API

### Usuários (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Listar todos os usuários |
| GET | `/users/:id` | Buscar usuário por ID |
| POST | `/users` | Criar novo usuário |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Deletar usuário |
| GET | `/users/search?q=termo` | Pesquisar usuários |

### Cupons (`/coupons`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/coupons` | Listar todos os cupons |
| GET | `/coupons/:id` | Buscar cupom por ID |
| GET | `/coupons/validate/:code` | Validar cupom por código |
| POST | `/coupons` | Criar novo cupom |
| PUT | `/coupons/:id` | Atualizar cupom |
| DELETE | `/coupons/:id` | Deletar cupom |
| POST | `/coupons/:id/use` | Usar cupom (incrementar contador) |
| GET | `/coupons/stats` | Estatísticas dos cupons |

### Afiliados (`/affiliates`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/affiliates` | Listar todos os afiliados |
| GET | `/affiliates/:id` | Buscar afiliado por ID |
| GET | `/affiliates/code/:code` | Buscar afiliado por código interno |
| POST | `/affiliates` | Criar novo afiliado |
| PUT | `/affiliates/:id` | Atualizar afiliado |
| DELETE | `/affiliates/:id` | Deletar afiliado |
| GET | `/affiliates/search?q=termo` | Pesquisar afiliados |
| GET | `/affiliates/:id/stats` | Estatísticas do afiliado |

### Dashboard (`/dashboard`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Dados principais do dashboard |
| GET | `/dashboard/revenue?period=month` | Dados de receita por período |
| GET | `/dashboard/activity` | Atividade recente |

## 🎯 Uso dos Hooks

### Exemplo: Listagem de Usuários

```typescript
import { useUsers, useDeleteUser } from '@/hooks/useUsers';

function UsersPage() {
  const { data: users, loading, error, refetch } = useUsers();
  const { mutate: deleteUser, loading: deleting } = useDeleteUser();

  const handleDelete = async (id: string) => {
    const result = await deleteUser(id);
    if (result) {
      refetch(); // Recarregar lista
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          {user.name}
          <button 
            onClick={() => handleDelete(user.id)}
            disabled={deleting}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo: Criação de Cupom

```typescript
import { useCreateCoupon } from '@/hooks/useCoupons';

function CreateCouponForm() {
  const { mutate: createCoupon, loading } = useCreateCoupon();

  const handleSubmit = async (formData: CouponFormData) => {
    const result = await createCoupon(formData);
    if (result) {
      // Sucesso - usuário será notificado automaticamente
      router.push('/cupons');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Cupom'}
      </button>
    </form>
  );
}
```

## 🔄 Migração para Backend Real

### 1. Implementar Backend

Crie um backend que implemente os endpoints documentados acima, respeitando as mesmas estruturas de dados definidas em `src/types/index.ts`.

### 2. Alterar Configuração

```typescript
// src/services/api/config.ts
export const API_CONFIG = {
  USE_MOCK: false, // ← Alterar para false
  BASE_URL: 'https://sua-api.com/api',
};
```

### 3. Implementar Autenticação (se necessário)

```typescript
// No seu contexto de autenticação
import { apiClient } from '@/services/api';

const login = async (credentials) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  const { token } = await response.json();
  
  // Configurar token para todas as chamadas
  apiClient.setAuthToken(token);
  
  // Salvar token no localStorage
  localStorage.setItem('authToken', token);
};
```

## 📊 Estruturas de Dados

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: "admin" | "afiliado" | "polo";
}
```

### Coupon
```typescript
interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  subscriptionDiscount: number;
  availableQuantity: number;
  usedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  availabilityRules?: { /* ... */ };
}
```

### Affiliate
```typescript
interface Affiliate {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: { /* ... */ };
  internalCode: string;
  partnershipStartDate: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  notes?: string;
  pixKey: string;
  socialNetworks: { /* ... */ };
}
```

## 🚨 Tratamento de Erros

Os hooks automaticamente:
- Mostram toasts de erro/sucesso
- Gerenciam estados de loading
- Fornecem mensagens de erro legíveis

```typescript
const { data, loading, error, refetch } = useUsers();

// error conterá a mensagem de erro se houver
// loading indicará se a requisição está em andamento
// refetch permite recarregar os dados manualmente
```

## 🔍 Recursos Disponíveis

- ✅ Dados mockados completos
- ✅ Simulação de delay de rede
- ✅ Validações de negócio
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Notificações automáticas
- ✅ Hooks reutilizáveis
- ✅ TypeScript completo
- ✅ Fácil migração para backend real

## 📝 Notas Importantes

1. **Persistência**: Os dados mockados usam arrays em memória e não persistem entre reloads da página
2. **Validações**: Implementadas tanto no mock quanto preparadas para o backend
3. **Códigos únicos**: Afiliados recebem códigos internos gerados automaticamente
4. **Throttling**: Simulação de delay de rede para testar estados de loading
5. **Erros**: Tratamento consistente de erros com mensagens user-friendly