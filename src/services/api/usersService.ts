import { User } from "@/types";
import { API_CONFIG, ApiResponse, simulateNetworkDelay } from "./config";
import { MOCK_USERS } from "./mockData";
import axiosClient from "./axiosClient";

class UsersService {
  private mockUsers: User[] = [...MOCK_USERS];

  // GET /users - Listar usuários
  async getUsers(): Promise<ApiResponse<User[]>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      return {
        data: this.mockUsers,
        success: true,
        message: "Usuários carregados com sucesso"
      };
    }

    const response = await axiosClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  }

  // GET /users/:id - Buscar usuário por ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      const user = this.mockUsers.find(u => u.id === id);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        data: user,
        success: true,
        message: "Usuário encontrado"
      };
    }

    const response = await axiosClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  // POST /users - Criar novo usuário
  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      // Verificar se email já existe
      const existingUser = this.mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...userData
      };

      this.mockUsers.push(newUser);
      
      return {
        data: newUser,
        success: true,
        message: "Usuário criado com sucesso"
      };
    }

    const response = await axiosClient.post<ApiResponse<User>>('/users', userData);
    return response.data;
  }

  // PUT /users/:id - Atualizar usuário
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const userIndex = this.mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se novo email já existe (se foi alterado)
      if (userData.email && userData.email !== this.mockUsers[userIndex].email) {
        const existingUser = this.mockUsers.find(u => u.email === userData.email && u.id !== id);
        if (existingUser) {
          throw new Error('Email já cadastrado');
        }
      }

      const updatedUser = { ...this.mockUsers[userIndex], ...userData };
      this.mockUsers[userIndex] = updatedUser;

      return {
        data: updatedUser,
        success: true,
        message: "Usuário atualizado com sucesso"
      };
    }

    const response = await axiosClient.patch<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  }

  // DELETE /users/:id - Deletar usuário
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const userIndex = this.mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      // Não permitir deletar o admin principal
      if (this.mockUsers[userIndex].email === 'admin@example.com') {
        throw new Error('Não é possível excluir o usuário administrador principal');
      }

      this.mockUsers.splice(userIndex, 1);

      return {
        data: undefined,
        success: true,
        message: "Usuário deletado com sucesso"
      };
    }

    const response = await axiosClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }

  // GET /users/search?q=term - Pesquisar usuários
  async searchUsers(searchTerm: string): Promise<ApiResponse<User[]>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const filteredUsers = this.mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(searchTerm)
      );

      return {
        data: filteredUsers,
        success: true,
        message: `${filteredUsers.length} usuários encontrados`
      };
    }

    const response = await axiosClient.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
}

export const usersService = new UsersService();