import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export function useLocations() {
  const { locations } = useApi();

  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      // console.log("Fetching locations (react-query)");

      return locations.getAll();
    },
    select: (data) => {
      const allLocations = Array.isArray(data) ? data : [];
      const locationsMap = Object.fromEntries(allLocations.map((tag) => [tag.id, tag]));
      return { locations: allLocations, locationsMap };
    },
    staleTime: 60 * 1000, 
    refetchInterval: 60 * 1000, // 1 min
    suspense: false,
  });
}

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { locations } = useApi()
  
  return useMutation({
    mutationFn: (newLocation) => locations.create(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location"], exact: false });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { locations } = useApi()

  return useMutation({
    mutationFn: ({ id, data }) => {
      return locations.delete(id)
    },
    onSuccess: () => {
      // Refetch after mutation to update frontend data
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location"], exact: false });
    },
  });
};
