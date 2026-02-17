import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export const useVersionLogs = ({ q } = {}) => {
    const { versionLogs } = useApi()

    return useQuery({
        queryKey: ['logs', q],
        queryFn: async () => {
            console.log("Fetching logs (react-query)", q)

            const params = new URLSearchParams();
            if (q) params.append("q", q);

            return versionLogs.getAll({ params });
        },
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}