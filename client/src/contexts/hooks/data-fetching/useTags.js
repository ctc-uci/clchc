import { useQuery } from "@tanstack/react-query";
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