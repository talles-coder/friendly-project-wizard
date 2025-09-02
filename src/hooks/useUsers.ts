import { User } from '@/types';
import { usersService } from '@/services/api';
import { useApi, useMutation } from './useApi';

// Hook para listar usuários
export function useUsers() {
  return useApi(() => usersService.getUsers());
}

// Hook para buscar usuário específico
export function useUser(id: string) {
  return useApi(() => usersService.getUserById(id), [id]);
}

// Hook para criar usuário
export function useCreateUser() {
  return useMutation<User, Omit<User, 'id'>>(
    (userData) => usersService.createUser(userData)
  );
}

// Hook para atualizar usuário
export function useUpdateUser() {
  return useMutation<User, { id: string; data: Partial<User> }>(
    ({ id, data }) => usersService.updateUser(id, data)
  );
}

// Hook para deletar usuário
export function useDeleteUser() {
  return useMutation<void, string>(
    (id) => usersService.deleteUser(id)
  );
}

// Hook para pesquisar usuários
export function useSearchUsers(searchTerm: string) {
  return useApi(() => usersService.searchUsers(searchTerm), [searchTerm]);
}