import { User } from "@/types";
import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

class UsersService {
  // GET /users - Listar usuários
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await axiosClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  }

  // GET /users/:id - Buscar usuário por ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await axiosClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  // POST /users - Criar novo usuário
  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    const response = await axiosClient.post<ApiResponse<User>>('/users', userData);
    return response.data;
  }

  // PUT /users/:id - Atualizar usuário
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await axiosClient.patch<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  }

  // DELETE /users/:id - Deletar usuário
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }

  // GET /users/search?q=term - Pesquisar usuários
  async searchUsers(searchTerm: string): Promise<ApiResponse<User[]>> {
    const response = await axiosClient.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
}

export const usersService = new UsersService();
