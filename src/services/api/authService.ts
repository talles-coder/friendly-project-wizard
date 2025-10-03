import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangeFirstPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  // POST /auth/forgot-password - Solicitar reset de senha
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await axiosClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return response.data;
  }

  // POST /auth/reset-password - Resetar senha com token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await axiosClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, newPassword }
    );
    return response.data;
  }

  // POST /auth/change-first-password - Alterar senha de primeiro acesso
  async changeFirstPassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await axiosClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-first-password',
      { currentPassword, newPassword }
    );
    return response.data;
  }
}

export const authService = new AuthService();
