import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export const useVersionLogs = ({ q } = {}) => {
    const { versionLogs } = useApi()

    return useQuery({
        queryKey: ['logs', q],
        queryFn: async () => {
            // console.log("Fetching logs (react-query)", q)

            const params = new URLSearchParams();
            if (q) params.append("q", q);

            return versionLogs.getAll({ params });
        },
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export const useCreateLog = () => {
  const { versionLogs } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
    //   console.log("Creating log (react-query)", data);
      return versionLogs.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['logs'], { exact: false });
    },
  })
}