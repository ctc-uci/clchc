import { useEffect, useMemo, useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
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
import { MdDeleteOutline } from "react-icons/md";

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
    if (e?.stopPropagation) {
      e.stopPropagation();
    }
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
      {Array.isArray(selectedTags) && selectedTags.length > 0 && (
        <HStack
          spacing={1}
          wrap="wrap"
        >
          {selectedTags.map((tagId) => {
            if (!tagId) return null;
            return (
              <Tag
                size="md"
                key={tagId}
                variant="solid"
                backgroundColor="black"
                borderRadius={"4px"}
                gap={"6px"}
                padding={"5px 8px"}
                // minH={"30px"}
                color={"#FFF"}
                fontFamily={"Inter"}
                fontSize={"14px"}
                fontStyle={"normal"}
                fontWeight={"500"}
                lineHeight={"16px"}
              >
                <TagLabel>{tagsMap[tagId]?.tagValue || ""}</TagLabel>
                {!readOnly && (
                  <TagCloseButton onClick={handleRemoveTag(tagId)} />
                )}
              </Tag>
            );
          })}
        </HStack>
      )}

      <Menu
        closeOnSelect={false}
        isLazy={false}
        matchWidth
      >
        <MenuButton
          as={Button}
          variant="outline"
          w="100%"
          justifyContent="flex-start"
          textAlign="left"
          rightIcon={<ChevronDown size={20} />}
          isDisabled={readOnly}
          color={"var(--gray-700, #2D3748)"}
          fontFamily={"Inter"}
          fontSize={"14px"}
          fontWeight={"400"}
          lineHeight={"20px"}
          fontStyle={"normal"}
          borderRadius={"4px"}
          border={"1px solid var(--gray-200, #E2E8F0)"}
          background={"var(--white, #FFF)"}
        >
          Select
        </MenuButton>

        <MenuList
          maxHeight="240px"
          overflowY="auto"
          minW="0"
        >
          {tags.map((tag) => (
            <HStack
              key={tag.id}
              pl={3}
              pr={0}
              py={2}
              // gap={2}
              justifyContent="space-between"
              w="100%"
              cursor={readOnly ? "default" : "pointer"}
              onClick={() => {
                if (readOnly) return;
                if (selectedIds.includes(tag.id)) {
                  onTagsChange(selectedIds.filter((id) => id !== tag.id));
                } else {
                  onTagsChange([...selectedIds, tag.id]);
                }
              }}
              _hover={readOnly ? {} : { bg: "gray.100" }}
            >
              {!readOnly && (
                <Checkbox
                  isChecked={selectedIds.includes(tag.id)}
                  onChange={() => {}}
                  colorScheme="blue"
                  size="md"
                  pointerEvents="none"
                />
              )}
              <Text
                flex="1"
                fontSize="12px"
                fontWeight="400"
              >
                {tag.tagValue}
              </Text>
              {!readOnly && (
                <Button
                  as="span"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag)(e);
                  }}
                  isLoading={!!deletingMap[tag.id]}
                >
                  <MdDeleteOutline size={20} />
                </Button>
              )}
            </HStack>
          ))}
          <HStack
            px={3}
            py={2}
            gap={2}
          >
            <Input
              placeholder="New tag"
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              isDisabled={readOnly}
              variant="outline"
              fontFamily={"Inter"}
              fontStyle={"normal"}
              lineHeight={"20px"}
              fontSize="12px"
              fontWeight="400"
              color="black"
              border={"1px solid var(--gray-200, #E2E8F0)"}
              borderRadius="4px"
              w="100%"
              h="30px"
              padding={"10px"}
              margin={"0"}
              _placeholder={{ color: "#A0AEC0" }}
            />
            <Button
              size="xs"
              onClick={handleCreateTag}
              isDisabled={readOnly || creating}
              variant="ghost"
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
            >
              {creating ? <Spinner size="xs" /> : <AddIcon />}
            </Button>
          </HStack>
        </MenuList>
      </Menu>
    </VStack>
  );
};

export default TagSelect;
