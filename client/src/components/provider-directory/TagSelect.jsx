import { useEffect, useMemo, useRef, useState } from "react";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useApi } from "@/api.js";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";
import { errorToString } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

const TagSelect = ({
  categoryId,
  tags,
  selectedTags,
  onTagsChange,
  readOnly,
  onRequestDeleteTag,
}) => {
  const queryClient = useQueryClient();
  const { data: tagsData, refetch: refetchTags } = useTags();
  const tagsMap = tagsData?.tagsMap ?? {};
  const { tags: tagsApi } = useApi();
  const [newTagValue, setNewTagValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingMap, setDeletingMap] = useState({});
  const toast = useToast();
  const useConfirmDelete = typeof onRequestDeleteTag === "function";

  const selectedIds = useMemo(() => {
    return Array.isArray(selectedTags) ? selectedTags : [];
  }, [selectedTags]);
  const selectedIdsRef = useRef(selectedIds);

  // avoid race condition during async: use ref for latest tags
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  const handleRemoveTag = (tagId) => (e) => {
    e.stopPropagation();
    if (readOnly) {
      return;
    }
    const nextTags = selectedIds.filter((id) => id !== tagId);
    onTagsChange(nextTags);
  };

  const handleCreateTag = async (e) => {
    e.stopPropagation();
    const trimmedTag = newTagValue.trim();
    if (readOnly || !trimmedTag) return;
    setCreating(true);

    const tempId = `tag-temp-${Date.now()}`;
    const optimisticTag = { id: tempId, categoryId, tagValue: trimmedTag };
    const prevTags = queryClient.getQueryData(["tags"]);
    const prevSelectedIds = selectedIdsRef.current;

    try {
      // add tag optimistically
      await queryClient.cancelQueries({ queryKey: ["tags"] });
      queryClient.setQueryData(["tags"], (oldData) => {
        const curr = oldData?.tags ?? (Array.isArray(oldData) ? oldData : []);
        const next = [...curr, optimisticTag];
        return {
          tags: next,
          tagsMap: Object.fromEntries(next.map((t) => [t.id, t])),
        };
      });
      onTagsChange([...prevSelectedIds, tempId]);
      setNewTagValue("");

      const rawCreated = await tagsApi.create({
        tagValue: trimmedTag,
        categoryId,
      });

      const newTag = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
      const newTagId = newTag?.id;

      // replace optimistic tag with actual tag
      if (newTagId !== undefined && newTagId !== null) {
        queryClient.setQueryData(["tags"], (oldData) => {
          const curr = oldData?.tags ?? (Array.isArray(oldData) ? oldData : []);
          const next = curr.map((t) => (t?.id === tempId ? newTag : t));
          return {
            tags: next,
            tagsMap: Object.fromEntries(next.map((t) => [t.id, t])),
          };
        });

        const latestSelected = selectedIdsRef.current;
        const replaced = latestSelected.map((id) =>
          id === tempId ? newTagId : id
        );
        onTagsChange([...new Set(replaced)]);
      }

      queryClient.invalidateQueries({ queryKey: ["providers"] });
      queryClient.invalidateQueries({ queryKey: ["providersSummary"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      if (typeof refetchTags === "function") {
        await refetchTags();
      }

      // feedback for successfully (or not) creating tags
      toast({
        title: "Success",
        description: "New tag created!",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to create tag", err);

      // undo optimistic updates
      queryClient.setQueryData(["tags"], prevTags);
      onTagsChange(prevSelectedIds);
      setNewTagValue(trimmedTag);

      toast({
        title: "Error",
        description: errorToString(err),
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = (tag) => (e) => {
    e.stopPropagation();
    if (readOnly) return;

    if (useConfirmDelete) {
      onRequestDeleteTag(tag);
      return;
    }

    (async () => {
      const tagId = tag?.id ?? tag;
      setDeletingMap((m) => ({ ...m, [tagId]: true }));

      const prevTags = queryClient.getQueryData(["tags"]);
      const prevSelectedIds = selectedIdsRef.current;

      try {
        await queryClient.cancelQueries({ queryKey: ["tags"] });
        queryClient.setQueryData(["tags"], (old) => {
          const curr = old?.tags ?? (Array.isArray(old) ? old : []);
          const next = curr.filter((t) => t?.id !== tagId);
          return {
            tags: next,
            tagsMap: Object.fromEntries(next.map((t) => [t.id, t])),
          };
        });
        if (prevSelectedIds.includes(tagId)) {
          onTagsChange(prevSelectedIds.filter((id) => id !== tagId));
        }

        await tagsApi.delete(tagId);

        queryClient.invalidateQueries({
          predicate: (query) =>
            ["providers", "providersSummary", "tags"].includes(
              query.queryKey[0]
            ),
        });

        if (typeof refetchTags === "function") await refetchTags();
        toast({
          title: "Success",
          description: "Tag successfully deleted!",
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        console.error("Failed to delete tag", err);
        queryClient.setQueryData(["tags"], prevTags);
        onTagsChange(prevSelectedIds);
        toast({
          title: "Error",
          description: errorToString(err),
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setDeletingMap((m) => {
          const copy = { ...m };
          delete copy[tagId];
          return copy;
        });
      }
    })();
  };

  return (
    <VStack
      spacing={2}
      align="stretch"
    >
      <HStack
        spacing={1}
        wrap="wrap"
      >
        {Array.isArray(selectedTags) &&
          selectedTags.map((tagId) => {
            if (!tagId) return null;
            return (
              <Tag
                size="md"
                key={tagId}
                borderRadius="full"
                variant="solid"
                backgroundColor="black"
              >
                <TagLabel>{tagsMap[tagId]?.tagValue || ""}</TagLabel>
                {!readOnly && (
                  <TagCloseButton onClick={handleRemoveTag(tagId)} />
                )}
              </Tag>
            );
          })}
      </HStack>

      <Menu
        closeOnSelect={false}
        isLazy={false}
      >
        <MenuButton
          as={Button}
          variant="outline"
          w="100%"
          justifyContent="flex-start"
          textAlign="left"
          fontWeight="normal"
          rightIcon={<ChevronDown />}
          isDisabled={readOnly}
        >
          Select Tags
        </MenuButton>

        <MenuList
          maxHeight="240px"
          overflowY="auto"
        >
          <MenuOptionGroup
            title="Select Tags"
            type="checkbox"
            value={selectedIds}
            onChange={(values) =>
              onTagsChange(values.filter((id) => id !== null && id !== ""))
            }
          >
            {tags.map((tag) => (
              <MenuItemOption
                key={tag.id}
                value={tag.id}
              >
                <HStack
                  justifyContent="space-between"
                  w="100%"
                >
                  <Text>{tag.tagValue}</Text>
                  {!readOnly && (
                    <Button
                      size="xs"
                      colorScheme="gray"
                      onClick={handleDeleteTag(tag)}
                      isLoading={!!deletingMap[tag.id]}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </HStack>
              </MenuItemOption>
            ))}
            <HStack
              px={3}
              py={2}
              gap={2}
            >
              <Input
                placeholder="New tag"
                size="sm"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                isDisabled={readOnly}
              />
              <Button
                size="xs"
                onClick={handleCreateTag}
                isDisabled={readOnly || creating}
              >
                {creating ? <Spinner size="xs" /> : <AddIcon />}
              </Button>
            </HStack>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </VStack>
  );
};

export default TagSelect;
