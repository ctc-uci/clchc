import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export function useTags() {
  const { tags } = useApi();

  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      // console.log("Fetching categories (react-query)");

      return tags.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
    suspense: false,
  });
}