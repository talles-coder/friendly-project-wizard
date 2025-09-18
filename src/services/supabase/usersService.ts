import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { ApiResponse } from '../api/config';

// Função para mapear dados do banco para o tipo User
function mapDbToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    cpf: dbUser.cpf,
    phone: dbUser.phone,
    role: dbUser.role,
    status: dbUser.status,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  };
}

// Função para mapear dados do tipo User para o banco
function mapUserToDb(user: Partial<User>): any {
  return {
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    role: user.role,
    status: user.status
  };
}

export class SupabaseUsersService {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(mapDbToUser) || [],
      success: true,
      message: 'Usuários carregados com sucesso'
    };
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Usuário não encontrado');

    return {
      data: mapDbToUser(data),
      success: true,
      message: 'Usuário encontrado'
    };
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    const dbData = mapUserToDb(userData);
    const { data, error } = await supabase
      .from('users')
      .insert(dbData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToUser(data!),
      success: true,
      message: 'Usuário criado com sucesso'
    };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const dbData = mapUserToDb(userData);
    const { data, error } = await supabase
      .from('users')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToUser(data!),
      success: true,
      message: 'Usuário atualizado com sucesso'
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return {
      data: undefined,
      success: true,
      message: 'Usuário deletado com sucesso'
    };
  }

  async searchUsers(searchTerm: string): Promise<ApiResponse<User[]>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(mapDbToUser) || [],
      success: true,
      message: 'Busca realizada com sucesso'
    };
  }
}

export const supabaseUsersService = new SupabaseUsersService();