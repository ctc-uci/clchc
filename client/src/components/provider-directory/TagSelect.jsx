import { useState } from "react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
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
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useApi } from "@/api.js";
import { ChevronDown } from "lucide-react";
import { useTagsContext } from "./tags/TagsContext";

const TagSelect = ({
  categoryId,
  tags,
  selectedTags,
  onTagsChange,
  readOnly,
}) => {
  const { tagsMap, refetchTags } = useTagsContext();
  const { tags: tagsApi } = useApi();
  const [newTagValue, setNewTagValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingMap, setDeletingMap] = useState({});
  const toast = useToast();

  const handleRemoveTag = (tagId) => (e) => {
    e.stopPropagation();
    if (readOnly) {
      return;
    }
    const nextTags = selectedTags.filter((id) => id !== tagId);
    onTagsChange(nextTags);
  };

  const handleCreateTag = async (e) => {
    e.stopPropagation();
    if (readOnly || !newTagValue.trim()) return;
    setCreating(true);
    try {
      const created = await tagsApi.create({
        tagValue: newTagValue.trim(),
        categoryId,
      });
      
      onTagsChange(
        Array.isArray(selectedTags)
          ? [...selectedTags, created.id]
          : [created.id]
      );
      setNewTagValue("");
      
      if (typeof refetchTags === "function") await refetchTags();
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
      toast({
        title: "Error",
        description: err,
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = (tagId) => async (e) => {
    e.stopPropagation();
    if (readOnly) return;
    setDeletingMap((m) => ({ ...m, [tagId]: true }));
    try {
      await tagsApi.delete(tagId);
      // if selected, removed from selectedTags too when deleting
      if (Array.isArray(selectedTags) && selectedTags.includes(tagId)) {
        const next = selectedTags.filter((id) => id !== tagId);
        onTagsChange(next);
      }
      if (typeof refetchTags === "function") await refetchTags();
      toast({ status: "success", title: "Tag deleted" });
    } catch (err) {
      console.error("Failed to delete tag", err);
      toast({ status: "error", title: "Failed to delete tag" });
    } finally {
      setDeletingMap((m) => {
        const copy = { ...m };
        delete copy[tagId];
        return copy;
      });
    }
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
            value={selectedTags}
            onChange={onTagsChange}
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
                  <span>{tag.tagValue}</span>
                  {!readOnly && (
                    <Button
                      size="xs"
                      colorScheme="gray"
                      onClick={handleDeleteTag(tag.id)}
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
