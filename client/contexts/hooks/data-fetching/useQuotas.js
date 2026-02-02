import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export const useQuotas = ({ date, provider } = {}) => {
  return useQuery({
    queryKey: ["quotas", { date, provider }],
    queryFn: async () => {
      console.log("Fetching quotas (react-query)", { date, provider });

      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (provider) params.append("provider", provider);

      return api.quotas.getAll({ params });
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
};

export const useQuotaById = (id) => {
  return useQuery({
    queryKey: ["quota", id],
    queryFn: async () => api.quotas.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.quotas.update(id, data),
    onMutate: ({ id, data }) => {
      // Optimistic update
      const previousQuotas = queryClient.getQueryData(["quotas"]);
      queryClient.setQueryData(["quotas"], old =>
        old.map(q => q.id === id ? { ...q, ...data } : q)
      );
      return { previousQuotas };
    },
    onError: (err, variables, context) => {
      // Rollback if mutation fails
      queryClient.setQueryData(["quotas"], context.previousQuotas);
    },
    // onSettled: () => {
    //   // Refetch just in case
    //   queryClient.invalidateQueries({ queryKey: ["quotas"] });
    // },
  });
};

export const useCreateQuota = () => {
  return useMutation({
    mutationFn: (newQuota) => api.quotas.create(newQuota),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotas"] });
    },
  });
};

