import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log("Fetching locations (react-query)");

      return api.locations.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}