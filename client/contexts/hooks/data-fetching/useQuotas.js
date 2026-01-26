import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export const useQuotas = (filter = {}) => {
  return useQuery({
    queryKey: ["quotas", filter],
    queryFn: async () => {
      let allQuotas = await api.quotas.getAll();

      // client-side filtering by provider name
      if (filter.provider) {
        allQuotas = allQuotas.filter((q) =>
          q.providerName.toLowerCase().includes(filter.provider.toLowerCase())
        );
      }

      return allQuotas;
    },
    keepPreviousData: true,
  });
};
