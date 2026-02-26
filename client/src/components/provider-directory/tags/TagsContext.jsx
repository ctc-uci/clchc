import { createContext, useContext, useMemo } from "react";

import { useTags } from "@/contexts/hooks/data-fetching/useTags";

const TagsContext = createContext(null);

export const TagsProvider = ({ children }) => {
  const {
    data: tags = [],
    isLoading: tagsLoading,
    refetch: refetchTags,
  } = useTags();

  // Map of id:tag for all tags.
  const tagsMap = useMemo(() => {
    return Object.fromEntries(tags.map((tag) => [tag.id, tag]));
  }, [tags]);

  const value = useMemo(() => {
    return {
      tags,
      tagsMap,
      tagsLoading,
      refetchTags,
    };
  }, [tags, tagsMap, tagsLoading, refetchTags]);

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export const useTagsContext = () => {
  const tagsContext = useContext(TagsContext);
  if (!tagsContext) {
    console.error("useTagsContext must be called within TagsProvider");
  }
  return tagsContext;
};
