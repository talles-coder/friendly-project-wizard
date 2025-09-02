import { Affiliate } from '@/types';
import { affiliatesService } from '@/services/api';
import { useApi, useMutation } from './useApi';

// Hook para listar afiliados
export function useAffiliates() {
  return useApi(() => affiliatesService.getAffiliates());
}

// Hook para buscar afiliado específico
export function useAffiliate(id: string) {
  return useApi(() => affiliatesService.getAffiliateById(id), [id]);
}

// Hook para buscar afiliado por código
export function useAffiliateByCode(code: string) {
  return useApi(() => affiliatesService.getAffiliateByCode(code), [code]);
}

// Hook para criar afiliado
export function useCreateAffiliate() {
  return useMutation<Affiliate, Omit<Affiliate, 'id' | 'internalCode'>>(
    (affiliateData) => affiliatesService.createAffiliate(affiliateData)
  );
}

// Hook para atualizar afiliado
export function useUpdateAffiliate() {
  return useMutation<Affiliate, { id: string; data: Partial<Affiliate> }>(
    ({ id, data }) => affiliatesService.updateAffiliate(id, data)
  );
}

// Hook para deletar afiliado
export function useDeleteAffiliate() {
  return useMutation<void, string>(
    (id) => affiliatesService.deleteAffiliate(id)
  );
}

// Hook para pesquisar afiliados
export function useSearchAffiliates(searchTerm: string) {
  return useApi(() => affiliatesService.searchAffiliates(searchTerm), [searchTerm]);
}

// Hook para estatísticas do afiliado
export function useAffiliateStats(id: string) {
  return useApi(() => affiliatesService.getAffiliateStats(id), [id]);
}