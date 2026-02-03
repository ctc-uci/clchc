import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: api.providers.getAll(),
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useCreateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProvider) => api.quotas.create(newProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};
