import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      console.log("Fetching providers (react-query)");

      return api.providers.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}

export function useProvidersSummary() {
  return useQuery({
    queryKey: ["providersSummary"],
    queryFn: async () => {
      console.log("Fetching provider summary (react-query)");

      return api.providers.getSummary();
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useCreateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProvider) => api.providers.create(newProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};

