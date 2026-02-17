import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export function useLocations() {
  const { locations } = useApi();

  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log("Fetching locations (react-query)");

      return locations.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}