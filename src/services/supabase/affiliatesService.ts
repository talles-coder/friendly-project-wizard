import { supabase } from '@/integrations/supabase/client';
import { Affiliate } from '@/types';
import { ApiResponse } from '../api/config';

// Função para mapear dados do banco para o tipo Affiliate
function mapDbToAffiliate(dbAffiliate: any): Affiliate {
  return {
    id: dbAffiliate.id,
    name: dbAffiliate.name,
    email: dbAffiliate.email,
    phone: dbAffiliate.phone || '',
    cpf: dbAffiliate.cpf || '',
    birthDate: dbAffiliate.birth_date || '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    internalCode: dbAffiliate.internal_code,
    affiliateCode: dbAffiliate.affiliate_code,
    commissionRate: dbAffiliate.commission_rate,
    commissionType: dbAffiliate.commission_type,
    subscriptionCommissionRate: 0,
    subscriptionCommissionType: 'percentage',
    status: dbAffiliate.status,
    partnershipStartDate: dbAffiliate.created_at,
    paymentType: dbAffiliate.repasse_type === 'pix' ? 'pix' : 'bank',
    bankData: {
      repasseType: dbAffiliate.repasse_type,
      pixKey: dbAffiliate.pix_key,
      pixName: dbAffiliate.pix_name,
      pixBank: dbAffiliate.pix_bank,
      bankCode: dbAffiliate.bank_code || '',
      bankName: dbAffiliate.bank_name || '',
      agency: dbAffiliate.bank_agency || '',
      account: dbAffiliate.bank_account || '',
      bankAgency: dbAffiliate.bank_agency,
      bankAccount: dbAffiliate.bank_account
    },
    socialNetworks: {
      facebook: '',
      tiktok: '',
      instagram: '',
      youtube: ''
    },
    createdAt: dbAffiliate.created_at,
    updatedAt: dbAffiliate.updated_at
  };
}

// Função para mapear dados do tipo Affiliate para o banco
function mapAffiliateToDb(affiliate: Partial<Affiliate>): any {
  return {
    name: affiliate.name,
    email: affiliate.email,
    phone: affiliate.phone,
    cpf: affiliate.cpf,
    affiliate_code: affiliate.affiliateCode,
    commission_rate: affiliate.commissionRate,
    commission_type: affiliate.commissionType,
    status: affiliate.status,
    repasse_type: affiliate.bankData?.repasseType,
    pix_key: affiliate.bankData?.pixKey,
    pix_name: affiliate.bankData?.pixName,
    pix_bank: affiliate.bankData?.pixBank,
    bank_code: affiliate.bankData?.bankCode,
    bank_name: affiliate.bankData?.bankName,
    bank_agency: affiliate.bankData?.bankAgency || affiliate.bankData?.agency,
    bank_account: affiliate.bankData?.bankAccount || affiliate.bankData?.account
  };
}

export class SupabaseAffiliatesService {
  async getAffiliates(): Promise<ApiResponse<Affiliate[]>> {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(mapDbToAffiliate) || [],
      success: true,
      message: 'Afiliados carregados com sucesso'
    };
  }

  async getAffiliateById(id: string): Promise<ApiResponse<Affiliate>> {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Afiliado não encontrado');

    return {
      data: mapDbToAffiliate(data),
      success: true,
      message: 'Afiliado encontrado'
    };
  }

  async getAffiliateByCode(code: string): Promise<ApiResponse<Affiliate>> {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('affiliate_code', code)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Afiliado não encontrado');

    return {
      data: mapDbToAffiliate(data),
      success: true,
      message: 'Afiliado encontrado'
    };
  }

  async createAffiliate(affiliateData: Omit<Affiliate, 'id' | 'internalCode'>): Promise<ApiResponse<Affiliate>> {
    // Gerar código interno único
    const internalCode = `AFF-${Date.now()}`;
    
    const dbData = mapAffiliateToDb(affiliateData);
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        ...dbData,
        internal_code: internalCode
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToAffiliate(data!),
      success: true,
      message: 'Afiliado criado com sucesso'
    };
  }

  async updateAffiliate(id: string, affiliateData: Partial<Affiliate>): Promise<ApiResponse<Affiliate>> {
    const dbData = mapAffiliateToDb(affiliateData);
    const { data, error } = await supabase
      .from('affiliates')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToAffiliate(data!),
      success: true,
      message: 'Afiliado atualizado com sucesso'
    };
  }

  async deleteAffiliate(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase
      .from('affiliates')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return {
      data: undefined,
      success: true,
      message: 'Afiliado deletado com sucesso'
    };
  }

  async searchAffiliates(searchTerm: string): Promise<ApiResponse<Affiliate[]>> {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,affiliate_code.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(mapDbToAffiliate) || [],
      success: true,
      message: 'Busca realizada com sucesso'
    };
  }

  async getAffiliateStats(id: string): Promise<ApiResponse<{
    totalCommissions: number;
    totalSales: number;
    conversionRate: number;
    lastSale: string | null;
  }>> {
    // Simular estatísticas por enquanto - pode ser implementado com view/função no futuro
    return {
      data: {
        totalCommissions: 0,
        totalSales: 0,
        conversionRate: 0,
        lastSale: null
      },
      success: true,
      message: 'Estatísticas carregadas'
    };
  }
}

export const supabaseAffiliatesService = new SupabaseAffiliatesService();