import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: api.providers.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}