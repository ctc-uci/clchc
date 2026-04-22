import { useEffect, useMemo, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  HStack,
  Input,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  VStack,
  useToast,
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
  onDifferentChange,
}) => {
  const queryClient = useQueryClient();
  const { data: tagsData, refetch: refetchTags } = useTags();
  const tagsMap = tagsData?.tagsMap ?? {};
  const { tags: tagsApi } = useApi();
  const [newTagValue, setNewTagValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingNewTags, setPendingNewTags] = useState([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const toast = useToast();

  const selectedIds = useMemo(() => {
    return Array.isArray(selectedTags) ? selectedTags : [];
  }, [selectedTags]);

  const handleMenuOpen = () => {
    setPendingNewTags([]);
    setPendingDeleteIds([]);
    setMenuOpen((prev) => !prev);
  };

  const isDifferent = pendingNewTags.length > 0 || pendingDeleteIds.length > 0;

  useEffect(() => {
    if (typeof onDifferentChange === "function") {
      onDifferentChange(isDifferent);
    }
  }, [isDifferent, onDifferentChange]);

  const handleRemoveTag = (tagId) => (e) => {
    e.stopPropagation();
    if (readOnly) return;
    onTagsChange(selectedIds.filter((id) => id !== tagId));
  };


  const handleCreateTag = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    const trimmedTag = newTagValue.trim();
    if (readOnly || !trimmedTag) return;

    const alreadyExists = tags.some(
      (t) => t.tagValue.toLowerCase() === trimmedTag.toLowerCase()
    );
    const alreadyPending = pendingNewTags.some(
      (t) => t.tagValue.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (alreadyExists || alreadyPending) {
      toast({
        title: "Tag already exists",
        status: "warning",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setPendingNewTags((prev) => [
      ...prev,
      { tempId: `tag-temp-${Date.now()}`, tagValue: trimmedTag },
    ]);
    setNewTagValue("");
  };


  const handleDeleteTag = (tag) => (e) => {
    e.stopPropagation();
    if (readOnly) return;
    const tagId = tag?.id ?? tag;
    setPendingDeleteIds((prev) => [...prev, tagId]);
  };

  const handleSave = () => {
    setIsConfirmOpen(true);
  };


  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    try {
      const createdIds = [];
      for (const { tagValue } of pendingNewTags) {
        const rawCreated = await tagsApi.create({ tagValue, categoryId });
        const newTag = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
        if (newTag?.id !== null && newTag?.id !== undefined) createdIds.push(newTag.id);
      }

      for (const tagId of pendingDeleteIds) {
        await tagsApi.delete(tagId);
      }

      if (pendingNewTags.length > 0 || pendingDeleteIds.length > 0) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            ["providers", "providersSummary", "tags"].includes(
              query.queryKey[0]
            ),
        });
        if (typeof refetchTags === "function") await refetchTags();
      }

      const finalIds = [
        ...selectedIds.filter((id) => !pendingDeleteIds.includes(id)),
        ...createdIds,
      ];
      onTagsChange([...new Set(finalIds)]);
      setPendingNewTags([]);
      setPendingDeleteIds([]);
      setMenuOpen(false);
    } catch (err) {
      console.error("Failed to save tag changes", err);
      toast({
        title: "Error",
        description: errorToString(err),
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setPendingNewTags([]);
    setPendingDeleteIds([]);
    setMenuOpen(false);
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
        isOpen={menuOpen}
        onClose={() => {
          if (!isDifferent) setMenuOpen(false);
        }}
        closeOnBlur={!isDifferent}
        closeOnEsc={!isDifferent}
        closeOnSelect={false}
        isLazy={false}
        matchWidth
      >
        <MenuButton
          onClick={handleMenuOpen}
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
          {/* existing tags, minus any staged for deletion */}
          {tags
            .filter((tag) => !pendingDeleteIds.includes(tag.id))
            .map((tag) => (
              <HStack
                key={tag.id}
                pl={3}
                pr={0}
                py={2}
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
                  >
                    <MdDeleteOutline size={20} />
                  </Button>
                )}
              </HStack>
            ))}

          {pendingNewTags.map(({ tempId, tagValue }) => (
            <HStack
              key={tempId}
              pl={3}
              pr={0}
              py={2}
              justifyContent="space-between"
              w="100%"
              cursor="default"
              opacity={0.7}
            >
              {!readOnly && (
                <Checkbox
                  isChecked
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
                fontStyle="italic"
              >
                {tagValue}
              </Text>
              {!readOnly && (
                <Button
                  as="span"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingNewTags((prev) =>
                      prev.filter((t) => t.tempId !== tempId)
                    );
                  }}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTag(e);
              }}
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
              isDisabled={readOnly}
              variant="ghost"
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
            >
              <AddIcon />
            </Button>
          </HStack>
          <HStack
            px={3}
            py={2}
            gap={2}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <Button
              size="xs"
              variant="ghost"
              onClick={handleCancel}
              flex={1}
              borderRadius="6px"
            >
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={handleSave}
              isDisabled={!isDifferent}
              opacity={isDifferent ? 1 : 0.4}
              colorScheme="blue"
              flex={1}
              borderRadius="6px"
            >
              Save
            </Button>
          </HStack>
        </MenuList>
      </Menu>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="16px">Confirm tag changes</ModalHeader>
          <ModalBody>
            <VStack
              align="stretch"
              spacing={3}
            >
              {pendingNewTags.length > 0 && (
                <VStack
                  align="stretch"
                  spacing={1}
                >
                  <Text
                    fontWeight="600"
                    fontSize="14px"
                  >
                    Creating {pendingNewTags.length} tag
                    {pendingNewTags.length > 1 ? "s" : ""}:
                  </Text>
                  <UnorderedList pl={4}>
                    {pendingNewTags.map(({ tempId, tagValue }) => (
                      <ListItem
                        key={tempId}
                        fontSize="14px"
                      >
                        {tagValue}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </VStack>
              )}
              {pendingDeleteIds.length > 0 && (
                <VStack
                  align="stretch"
                  spacing={1}
                >
                  <Text
                    fontWeight="600"
                    fontSize="14px"
                  >
                    Deleting {pendingDeleteIds.length} tag
                    {pendingDeleteIds.length > 1 ? "s" : ""}:
                  </Text>
                  <UnorderedList pl={4}>
                    {pendingDeleteIds.map((id) => (
                      <ListItem
                        key={id}
                        fontSize="14px"
                      >
                        {tagsMap[id]?.tagValue ?? id}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TagSelect;
