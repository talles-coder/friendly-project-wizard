import { Coupon } from '@/types';
import { couponsService } from '@/services/api';
import { useApi, useMutation } from './useApi';

// Hook para listar cupons
export function useCoupons() {
  return useApi(() => couponsService.getCoupons());
}

// Hook para buscar cupom específico
export function useCoupon(id: string) {
  return useApi(() => couponsService.getCouponById(id), [id]);
}

// Hook para validar cupom por código
export function useValidateCoupon(code: string) {
  return useApi(() => couponsService.validateCoupon(code), [code]);
}

// Hook para criar cupom
export function useCreateCoupon() {
  return useMutation<Coupon, Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>>(
    (couponData) => couponsService.createCoupon(couponData)
  );
}

// Hook para atualizar cupom
export function useUpdateCoupon() {
  return useMutation<Coupon, { id: string; data: Partial<Coupon> }>(
    ({ id, data }) => couponsService.updateCoupon(id, data)
  );
}

// Hook para deletar cupom
export function useDeleteCoupon() {
  return useMutation<void, string>(
    (id) => couponsService.deleteCoupon(id)
  );
}

// Hook para usar cupom
export function useUseCoupon() {
  return useMutation<Coupon, { id: string; userId?: string }>(
    ({ id, userId }) => couponsService.useCoupon(id, userId)
  );
}

// Hook para estatísticas de cupons
export function useCouponsStats() {
  return useApi(() => couponsService.getCouponsStats());
}