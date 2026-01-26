import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useQuotas() {
  return useQuery({
    queryKey: ['quotas'],
    queryFn: api.quotas.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}