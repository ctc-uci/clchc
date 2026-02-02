import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: api.providers.getAll(),
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useCreateProvider = () => {
  return useMutation({
    mutationFn: (newProvider) => api.quotas.create(newProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};
