import { useState, useEffect } from 'react';
import { ApiResponse } from '@/services/api/config';
import { toast } from '@/hooks/use-toast';

// Hook genérico para chamadas de API
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Hook para mutações (POST, PUT, DELETE)
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await mutationFn(variables);
      
      toast({
        title: "Sucesso",
        description: response.message || "Operação realizada com sucesso"
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}