import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@server/src/api.js'

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

export const useQuotaById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["quota", id],
    queryFn: async () => {
      const res = await api.quotas.getById(id)
      const quota = Array.isArray(res) ? res[0] : res;
      console.log("Fetching quota by id (react-query)", id, quota);
      return quota;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled
  });
};

export const useUpdateQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {
      return api.quotas.update(id, data)
    },
    onSuccess: () => {
      // Refetch after mutation to update frontend data
      queryClient.invalidateQueries({ queryKey: ["quotas"] });
      queryClient.invalidateQueries({ queryKey: ["quota"], exact: false });
    },
  });
};

export const useCreateQuota = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newQuota) => api.quotas.create(newQuota),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotas"] });
      queryClient.invalidateQueries({ queryKey: ["quota"], exact: false });
    },
  });
};

