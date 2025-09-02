import { Affiliate } from "@/types";
import { API_CONFIG, ApiResponse, apiClient, simulateNetworkDelay } from "./config";
import { MOCK_AFFILIATES } from "./mockData";

class AffiliatesService {
  private mockAffiliates: Affiliate[] = [...MOCK_AFFILIATES];

  // GET /affiliates - Listar afiliados
  async getAffiliates(): Promise<ApiResponse<Affiliate[]>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      return {
        data: this.mockAffiliates,
        success: true,
        message: "Afiliados carregados com sucesso"
      };
    }

    return apiClient.get<Affiliate[]>('/affiliates');
  }

  // GET /affiliates/:id - Buscar afiliado por ID
  async getAffiliateById(id: string): Promise<ApiResponse<Affiliate>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      const affiliate = this.mockAffiliates.find(a => a.id === id);
      
      if (!affiliate) {
        throw new Error('Afiliado não encontrado');
      }

      return {
        data: affiliate,
        success: true,
        message: "Afiliado encontrado"
      };
    }

    return apiClient.get<Affiliate>(`/affiliates/${id}`);
  }

  // GET /affiliates/code/:code - Buscar afiliado por código interno
  async getAffiliateByCode(code: string): Promise<ApiResponse<Affiliate>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      const affiliate = this.mockAffiliates.find(a => a.internalCode === code);
      
      if (!affiliate) {
        throw new Error('Afiliado não encontrado');
      }

      return {
        data: affiliate,
        success: true,
        message: "Afiliado encontrado"
      };
    }

    return apiClient.get<Affiliate>(`/affiliates/code/${code}`);
  }

  // POST /affiliates - Criar novo afiliado
  async createAffiliate(affiliateData: Omit<Affiliate, 'id' | 'internalCode'>): Promise<ApiResponse<Affiliate>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      // Verificar se email ou CPF já existe
      const existingAffiliate = this.mockAffiliates.find(a => 
        a.email === affiliateData.email || a.cpf === affiliateData.cpf
      );
      
      if (existingAffiliate) {
        throw new Error('Email ou CPF já cadastrado');
      }

      // Gerar código interno único
      const generateInternalCode = () => {
        const prefix = 'AFF';
        let code;
        do {
          code = prefix + Math.random().toString().substr(2, 6);
        } while (this.mockAffiliates.some(a => a.internalCode === code));
        return code;
      };

      const newAffiliate: Affiliate = {
        id: Date.now().toString(),
        internalCode: generateInternalCode(),
        ...affiliateData
      };

      this.mockAffiliates.push(newAffiliate);
      
      return {
        data: newAffiliate,
        success: true,
        message: "Afiliado criado com sucesso"
      };
    }

    return apiClient.post<Affiliate>('/affiliates', affiliateData);
  }

  // PUT /affiliates/:id - Atualizar afiliado
  async updateAffiliate(id: string, affiliateData: Partial<Affiliate>): Promise<ApiResponse<Affiliate>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const affiliateIndex = this.mockAffiliates.findIndex(a => a.id === id);
      if (affiliateIndex === -1) {
        throw new Error('Afiliado não encontrado');
      }

      // Verificar se novo email ou CPF já existe (se foi alterado)
      if (affiliateData.email || affiliateData.cpf) {
        const existingAffiliate = this.mockAffiliates.find(a => 
          (affiliateData.email && a.email === affiliateData.email && a.id !== id) ||
          (affiliateData.cpf && a.cpf === affiliateData.cpf && a.id !== id)
        );
        
        if (existingAffiliate) {
          throw new Error('Email ou CPF já cadastrado');
        }
      }

      const updatedAffiliate = { ...this.mockAffiliates[affiliateIndex], ...affiliateData };
      this.mockAffiliates[affiliateIndex] = updatedAffiliate;

      return {
        data: updatedAffiliate,
        success: true,
        message: "Afiliado atualizado com sucesso"
      };
    }

    return apiClient.put<Affiliate>(`/affiliates/${id}`, affiliateData);
  }

  // DELETE /affiliates/:id - Deletar afiliado
  async deleteAffiliate(id: string): Promise<ApiResponse<void>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const affiliateIndex = this.mockAffiliates.findIndex(a => a.id === id);
      if (affiliateIndex === -1) {
        throw new Error('Afiliado não encontrado');
      }

      this.mockAffiliates.splice(affiliateIndex, 1);

      return {
        data: undefined,
        success: true,
        message: "Afiliado deletado com sucesso"
      };
    }

    return apiClient.delete<void>(`/affiliates/${id}`);
  }

  // GET /affiliates/search?q=term - Pesquisar afiliados
  async searchAffiliates(searchTerm: string): Promise<ApiResponse<Affiliate[]>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const filteredAffiliates = this.mockAffiliates.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.cpf.includes(searchTerm) ||
        affiliate.internalCode.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        data: filteredAffiliates,
        success: true,
        message: `${filteredAffiliates.length} afiliados encontrados`
      };
    }

    return apiClient.get<Affiliate[]>(`/affiliates/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // GET /affiliates/:id/stats - Estatísticas do afiliado
  async getAffiliateStats(id: string): Promise<ApiResponse<{
    totalCommissions: number;
    totalSales: number;
    conversionRate: number;
    lastSale: string | null;
  }>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      // Mock das estatísticas
      const stats = {
        totalCommissions: Math.random() * 5000,
        totalSales: Math.floor(Math.random() * 100),
        conversionRate: Math.random() * 100,
        lastSale: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      return {
        data: stats,
        success: true,
        message: "Estatísticas carregadas com sucesso"
      };
    }

    return apiClient.get<{
      totalCommissions: number;
      totalSales: number;
      conversionRate: number;
      lastSale: string | null;
    }>(`/affiliates/${id}/stats`);
  }
}

export const affiliatesService = new AffiliatesService();