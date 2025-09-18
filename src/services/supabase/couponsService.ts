import { supabase } from '@/integrations/supabase/client';
import { Coupon } from '@/types';
import { ApiResponse } from '../api/config';

// Função para mapear dados do banco para o tipo Coupon
function mapDbToCoupon(dbCoupon: any): Coupon {
  return {
    id: dbCoupon.id,
    name: dbCoupon.description, // Usando description como name
    code: dbCoupon.code,
    description: dbCoupon.description,
    discountType: dbCoupon.discount_type,
    discountValue: dbCoupon.discount_value,
    subscriptionDiscount: 0, // Campo não implementado ainda
    availableQuantity: dbCoupon.max_uses || 0,
    usedCount: dbCoupon.used_count || 0,
    minPurchaseAmount: dbCoupon.min_purchase_amount || 0,
    validFrom: dbCoupon.valid_from,
    validUntil: dbCoupon.valid_until,
    isActive: dbCoupon.is_active,
    affiliateId: dbCoupon.affiliate_id,
    startDate: dbCoupon.valid_from || dbCoupon.created_at,
    createdBy: 'system', // Campo não implementado ainda
    createdAt: dbCoupon.created_at,
    updatedAt: dbCoupon.updated_at,
    availabilityRules: undefined // Campo não implementado ainda
  };
}

// Função para mapear dados do tipo Coupon para o banco
function mapCouponToDb(coupon: Partial<Coupon>): any {
  return {
    code: coupon.code,
    description: coupon.description,
    discount_type: coupon.discountType,
    discount_value: coupon.discountValue,
    max_uses: coupon.availableQuantity,
    min_purchase_amount: coupon.minPurchaseAmount,
    valid_from: coupon.validFrom,
    valid_until: coupon.validUntil,
    is_active: coupon.isActive,
    affiliate_id: coupon.affiliateId
  };
}

export class SupabaseCouponsService {
  async getCoupons(): Promise<ApiResponse<Coupon[]>> {
    const { data, error } = await supabase
      .from('coupons')
      .select(`
        *,
        affiliate:affiliates(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(mapDbToCoupon) || [],
      success: true,
      message: 'Cupons carregados com sucesso'
    };
  }

  async getCouponById(id: string): Promise<ApiResponse<Coupon>> {
    const { data, error } = await supabase
      .from('coupons')
      .select(`
        *,
        affiliate:affiliates(name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Cupom não encontrado');

    return {
      data: mapDbToCoupon(data),
      success: true,
      message: 'Cupom encontrado'
    };
  }

  async validateCoupon(code: string): Promise<ApiResponse<{
    valid: boolean;
    coupon?: Coupon;
    reason?: string;
  }>> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return {
        data: { valid: false, reason: 'Cupom não encontrado' },
        success: true,
        message: 'Validação concluída'
      };
    }

    // Verificar se ainda não atingiu o limite de usos
    if (data.max_uses && data.used_count >= data.max_uses) {
      return {
        data: { valid: false, reason: 'Cupom esgotado' },
        success: true,
        message: 'Validação concluída'
      };
    }

    // Verificar datas de validade
    const now = new Date();
    if (data.valid_from && new Date(data.valid_from) > now) {
      return {
        data: { valid: false, reason: 'Cupom ainda não válido' },
        success: true,
        message: 'Validação concluída'
      };
    }

    if (data.valid_until && new Date(data.valid_until) < now) {
      return {
        data: { valid: false, reason: 'Cupom expirado' },
        success: true,
        message: 'Validação concluída'
      };
    }

      return {
        data: { valid: true, coupon: mapDbToCoupon(data) },
        success: true,
        message: 'Cupom válido'
      };
  }

  async createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Coupon>> {
    const dbData = mapCouponToDb(couponData);
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        ...dbData,
        used_count: 0
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToCoupon(data!),
      success: true,
      message: 'Cupom criado com sucesso'
    };
  }

  async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    const dbData = mapCouponToDb(couponData);
    const { data, error } = await supabase
      .from('coupons')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToCoupon(data!),
      success: true,
      message: 'Cupom atualizado com sucesso'
    };
  }

  async deleteCoupon(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return {
      data: undefined,
      success: true,
      message: 'Cupom deletado com sucesso'
    };
  }

  async useCoupon(id: string, userId?: string): Promise<ApiResponse<Coupon>> {
    // Primeiro buscar o cupom atual
    const { data: currentCoupon, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Incrementar o usado count
    const { data, error } = await supabase
      .from('coupons')
      .update({ 
        used_count: (currentCoupon.used_count || 0) + 1
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      data: mapDbToCoupon(data!),
      success: true,
      message: 'Cupom utilizado com sucesso'
    };
  }

  async getCouponsStats(): Promise<ApiResponse<{
    totalCoupons: number;
    activeCoupons: number;
    totalUsage: number;
    topUsedCoupons: Coupon[];
  }>> {
    const [totalResult, activeResult, usageResult, topResult] = await Promise.all([
      supabase.from('coupons').select('id', { count: 'exact' }),
      supabase.from('coupons').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('coupons').select('used_count'),
      supabase.from('coupons').select('*').order('used_count', { ascending: false }).limit(5)
    ]);

    const totalUsage = usageResult.data?.reduce((sum, coupon) => sum + (coupon.used_count || 0), 0) || 0;

    return {
      data: {
        totalCoupons: totalResult.count || 0,
        activeCoupons: activeResult.count || 0,
        totalUsage,
        topUsedCoupons: topResult.data?.map(mapDbToCoupon) || []
      },
      success: true,
      message: 'Estatísticas carregadas'
    };
  }
}

export const supabaseCouponsService = new SupabaseCouponsService();