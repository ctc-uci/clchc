import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useDirectoryCategories() {
  return useQuery({
    queryKey: ['directoryCategories'],
    queryFn: async () => {
      console.log("Fetching categories (react-query)");

      return api.directoryCategories.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
  });
}