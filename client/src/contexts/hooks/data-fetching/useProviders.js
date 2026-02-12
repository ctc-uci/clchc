import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export function useProviders() {
  const { providers } = useApi()

  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      console.log("Fetching providers (react-query)");

      return providers.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}

export function useProvidersSummary() {
  const { providers } = useApi()

  return useQuery({
    queryKey: ["providersSummary"],
    queryFn: async () => {
      console.log("Fetching provider summary (react-query)");

      return providers.getSummary();
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useCreateProvider = () => {
  const queryClient = useQueryClient();
  const { providers } = useApi()

  return useMutation({
    mutationFn: (newProvider) => providers.create(newProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};

