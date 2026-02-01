import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export const useQuotas = () => {
  return useQuery({
    queryKey: ["quotas"],
    queryFn: async () => {
      console.log("fetching quotas");
      return api.quotas.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuotaById = (id) => {
  return useQuery({
    queryKey: ["quota", id],
    queryFn: () => api.quotas.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.quotas.update(id, data),
    onMutate: ({ id, data }) => {
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

