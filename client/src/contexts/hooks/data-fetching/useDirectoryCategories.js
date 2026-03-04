import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export function useDirectoryCategories() {
  const { directoryCategories } = useApi();

  return useQuery({
    queryKey: ['directoryCategories'],
    queryFn: async () => {
      // console.log("Fetching categories (react-query)");

      return directoryCategories.getAll();
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
    suspense: false,
  });
}

export const useCreateCategory = () => {
  const { directoryCategories } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory) => directoryCategories.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryCategories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const { directoryCategories } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, categoryData}) => directoryCategories.update(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryCategories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { directoryCategories } = useApi()

  return useMutation ({
    mutationFn: (id) => directoryCategories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryCategories"] });
    },
  });
};
