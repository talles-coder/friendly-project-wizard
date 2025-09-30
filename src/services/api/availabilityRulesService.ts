import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

export interface AvailabilityRule {
  id: string;
  coupon: string; // UUID do cupom
  discountType: string;
  baseValue?: number;
  limitValue?: number;
  unitFilter?: string;
  selectedUnits?: string[];
  courseFilter?: string;
  selectedCourses?: string[];
  ingressFormFilter?: string;
  selectedIngressForms?: string[];
  userFilter?: string;
  selectedUsers?: string[];
  semesterFilter?: string;
  selectedSemesters?: string[];
  initialValidity?: string; // data ISO
  finalValidity?: string; // data ISO
  createdAt?: string;
  updatedAt?: string;
}

class AvailabilityRulesService {
  // GET /availability-rules - Listar regras de disponibilidade
  async getAvailabilityRules(): Promise<ApiResponse<AvailabilityRule[]>> {
    const response = await axiosClient.get<ApiResponse<AvailabilityRule[]>>('/availability-rules');
    return response.data;
  }

  // GET /availability-rules/:id - Buscar regra por ID
  async getAvailabilityRuleById(id: string): Promise<ApiResponse<AvailabilityRule>> {
    const response = await axiosClient.get<ApiResponse<AvailabilityRule>>(`/availability-rules/${id}`);
    return response.data;
  }

  // POST /availability-rules - Criar nova regra
  async createAvailabilityRule(ruleData: Omit<AvailabilityRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AvailabilityRule>> {
    const response = await axiosClient.post<ApiResponse<AvailabilityRule>>('/availability-rules', ruleData);
    return response.data;
  }

  // PATCH /availability-rules/:id - Atualizar regra
  async updateAvailabilityRule(id: string, ruleData: Partial<AvailabilityRule>): Promise<ApiResponse<AvailabilityRule>> {
    const response = await axiosClient.patch<ApiResponse<AvailabilityRule>>(`/availability-rules/${id}`, ruleData);
    return response.data;
  }

  // DELETE /availability-rules/:id - Deletar regra
  async deleteAvailabilityRule(id: string): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete<ApiResponse<void>>(`/availability-rules/${id}`);
    return response.data;
  }
}

export const availabilityRulesService = new AvailabilityRulesService();
