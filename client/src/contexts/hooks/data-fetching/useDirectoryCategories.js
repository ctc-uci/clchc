import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@server/src/api.js'

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

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory) => api.directoryCategories.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryCategories"] });
    },
  });
};