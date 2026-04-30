import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "@/api.js";

export function useTags() {
  const { tags } = useApi();

  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => tags.getAll(),
    select: (data) => {
      const allTags = Array.isArray(data) ? data : [];
      const tagsMap = Object.fromEntries(allTags.map((tag) => [tag.id, tag]));
      return { tags: allTags, tagsMap };
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000, // 1 min
    suspense: false,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { tags } = useApi();

  return useMutation({
    mutationFn: (newTag) => tags.create(newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag"], exact: false });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const { tags } = useApi();

  return useMutation({
    mutationFn: ({ id }) => tags.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag"], exact: false });
    },
  });
}