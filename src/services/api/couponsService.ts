import { Coupon } from "@/types";
import { API_CONFIG, ApiResponse, simulateNetworkDelay } from "./config";
import { MOCK_COUPONS } from "./mockData";
import axiosClient from "./axiosClient";

class CouponsService {
  private mockCoupons: Coupon[] = [...MOCK_COUPONS];

  // GET /coupons - Listar cupons
  async getCoupons(): Promise<ApiResponse<Coupon[]>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      return {
        data: this.mockCoupons,
        success: true,
        message: "Cupons carregados com sucesso"
      };
    }

    const response = await axiosClient.get<ApiResponse<Coupon[]>>('/coupons');
    return response.data;
  }

  // GET /coupons/:id - Buscar cupom por ID
  async getCouponById(id: string): Promise<ApiResponse<Coupon>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      const coupon = this.mockCoupons.find(c => c.id === id);
      
      if (!coupon) {
        throw new Error('Cupom não encontrado');
      }

      return {
        data: coupon,
        success: true,
        message: "Cupom encontrado"
      };
    }

    const response = await axiosClient.get<ApiResponse<Coupon>>(`/coupons/${id}`);
    return response.data;
  }

  // GET /coupons/validate/:code - Validar cupom por código
  async validateCoupon(code: string): Promise<ApiResponse<{ valid: boolean; coupon?: Coupon; reason?: string }>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const coupon = this.mockCoupons.find(c => c.code === code);
      
      if (!coupon) {
        return {
          data: { valid: false, reason: "Cupom não encontrado" },
          success: true,
          message: "Validação concluída"
        };
      }

      if (!coupon.isActive) {
        return {
          data: { valid: false, coupon, reason: "Cupom inativo" },
          success: true,
          message: "Validação concluída"
        };
      }

      if (coupon.usedCount >= coupon.availableQuantity) {
        return {
          data: { valid: false, coupon, reason: "Cupom esgotado" },
          success: true,
          message: "Validação concluída"
        };
      }

      const today = new Date().toISOString().split('T')[0];
      if (today < coupon.startDate || today > coupon.validUntil) {
        return {
          data: { valid: false, coupon, reason: "Cupom fora do período de validade" },
          success: true,
          message: "Validação concluída"
        };
      }

      return {
        data: { valid: true, coupon },
        success: true,
        message: "Cupom válido"
      };
    }

    const response = await axiosClient.get<ApiResponse<{ valid: boolean; coupon?: Coupon; reason?: string }>>(`/coupons/validate/${code}`);
    return response.data;
  }

  // POST /coupons - Criar novo cupom
  async createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Coupon>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      // Verificar se código já existe entre cupons ativos
      const existingCoupon = this.mockCoupons.find(c => c.code === couponData.code && c.isActive);
      if (existingCoupon) {
        throw new Error('Já existe um cupom ativo com este código');
      }

      const now = new Date().toISOString();
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        usedCount: 0,
        createdAt: now,
        updatedAt: now,
        ...couponData
      };

      this.mockCoupons.push(newCoupon);
      
      return {
        data: newCoupon,
        success: true,
        message: "Cupom criado com sucesso"
      };
    }

    const response = await axiosClient.post<ApiResponse<Coupon>>('/coupons', couponData);
    return response.data;
  }

  // PUT /coupons/:id - Atualizar cupom
  async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const couponIndex = this.mockCoupons.findIndex(c => c.id === id);
      if (couponIndex === -1) {
        throw new Error('Cupom não encontrado');
      }

      // Verificar se novo código já existe (se foi alterado)
      if (couponData.code && couponData.code !== this.mockCoupons[couponIndex].code) {
        const existingCoupon = this.mockCoupons.find(c => c.code === couponData.code && c.isActive && c.id !== id);
        if (existingCoupon) {
          throw new Error('Já existe um cupom ativo com este código');
        }
      }

      const updatedCoupon = { 
        ...this.mockCoupons[couponIndex], 
        ...couponData,
        updatedAt: new Date().toISOString()
      };
      this.mockCoupons[couponIndex] = updatedCoupon;

      return {
        data: updatedCoupon,
        success: true,
        message: "Cupom atualizado com sucesso"
      };
    }

    const response = await axiosClient.patch<ApiResponse<Coupon>>(`/coupons/${id}`, couponData);
    return response.data;
  }

  // DELETE /coupons/:id - Deletar cupom
  async deleteCoupon(id: string): Promise<ApiResponse<void>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const couponIndex = this.mockCoupons.findIndex(c => c.id === id);
      if (couponIndex === -1) {
        throw new Error('Cupom não encontrado');
      }

      this.mockCoupons.splice(couponIndex, 1);

      return {
        data: undefined,
        success: true,
        message: "Cupom deletado com sucesso"
      };
    }

    const response = await axiosClient.delete<ApiResponse<void>>(`/coupons/${id}`);
    return response.data;
  }

  // POST /coupons/:id/use - Usar cupom (incrementar contador)
  async useCoupon(id: string, userId?: string): Promise<ApiResponse<Coupon>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const couponIndex = this.mockCoupons.findIndex(c => c.id === id);
      if (couponIndex === -1) {
        throw new Error('Cupom não encontrado');
      }

      const coupon = this.mockCoupons[couponIndex];
      
      if (coupon.usedCount >= coupon.availableQuantity) {
        throw new Error('Cupom esgotado');
      }

      coupon.usedCount += 1;
      coupon.updatedAt = new Date().toISOString();

      return {
        data: coupon,
        success: true,
        message: "Cupom utilizado com sucesso"
      };
    }

    const response = await axiosClient.post<ApiResponse<Coupon>>(`/coupons/${id}/use`, { userId });
    return response.data;
  }

  // GET /coupons/stats - Estatísticas dos cupons
  async getCouponsStats(): Promise<ApiResponse<{
    totalCoupons: number;
    activeCoupons: number;
    totalUsage: number;
    topUsedCoupons: Coupon[];
  }>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const totalCoupons = this.mockCoupons.length;
      const activeCoupons = this.mockCoupons.filter(c => c.isActive).length;
      const totalUsage = this.mockCoupons.reduce((sum, c) => sum + c.usedCount, 0);
      const topUsedCoupons = [...this.mockCoupons]
        .sort((a, b) => b.usedCount - a.usedCount)
        .slice(0, 5);

      return {
        data: {
          totalCoupons,
          activeCoupons,
          totalUsage,
          topUsedCoupons
        },
        success: true,
        message: "Estatísticas carregadas com sucesso"
      };
    }

    const response = await axiosClient.get<ApiResponse<{
      totalCoupons: number;
      activeCoupons: number;
      totalUsage: number;
      topUsedCoupons: Coupon[];
    }>>('/coupons/stats');
    return response.data;
  }
}

export const couponsService = new CouponsService();