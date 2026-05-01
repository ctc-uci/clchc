import { useEffect, useMemo, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  VStack,
  Checkbox,
  Icon,
} from "@chakra-ui/react";

import { useTags, useCreateTag, useDeleteTag } from "@/contexts/hooks/data-fetching/useTags";
import { errorToString } from "@/utils/utils";
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
  const { data: tagsData } = useTags();
  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const tagsMap = tagsData?.tagsMap ?? {};
  const [newTagValue, setNewTagValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isDeleteConfirmArmed, setIsDeleteConfirmArmed] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);

  const toast = useToast();

  const selectedIds = useMemo(
    () => (Array.isArray(selectedTags) ? selectedTags : []),
    [selectedTags]
  );
  const isDeletingTags = pendingDeleteIds.length > 0;

  const handleMenuOpen = () => {
    if (menuOpen) return;
    setPendingDeleteIds([]);
    setMenuOpen(true);
  };

  const isDifferent =
    pendingDeleteIds.length > 0 || (isAddingTag && newTagValue.trim().length > 0);

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

  const handleCreateTag = async () => {
    const trimmedTag = newTagValue.trim();
    if (readOnly || !trimmedTag) return false;

    const alreadyExists = tags.some(
      (t) => t.tagValue.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (alreadyExists) {
      toast({
        title: "Tag already exists",
        status: "warning",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const rawCreated = await createTag({ tagValue: trimmedTag, categoryId });
    const newTag = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
    if (newTag?.id === null || newTag?.id === undefined) return false;

    onTagsChange([...new Set([...selectedIds, newTag.id])]);
    setNewTagValue("");
    setIsAddingTag(false);
    return true;
  };

  const handleDeleteTag = (tag) => (e) => {
    e.stopPropagation();
    if (readOnly) return;
    const tagId = tag?.id ?? tag;
    if (pendingDeleteIds.includes(tagId)) {
        setPendingDeleteIds((prev) => prev.filter((id) => id !== tagId));
        setIsDeleteConfirmArmed(false);
        return;
    }
    setPendingDeleteIds((prev) => [...prev, tagId]);
    setIsDeleteConfirmArmed(false);
    setIsAddingTag(false);
    setNewTagValue("");
  };

  const handleSave = () => {
    if (isAddingTag && newTagValue.trim()) {
      handleCreateTag().catch((err) => {
        console.error("Failed to create tag", err);
        toast({
          title: "Error",
          description: errorToString(err),
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }
  };

  const handleDeleteAction = () => {
    if (!isDeleteConfirmArmed) {
      setIsDeleteConfirmArmed(true);
      return;
    }

    handleConfirm();
  };

  const handleConfirm = async () => {
    try {
      for (const tagId of pendingDeleteIds) {
        await deleteTag({ id: tagId });
      }

      const finalIds = [
        ...selectedIds.filter((id) => !pendingDeleteIds.includes(id)),
      ];
      onTagsChange([...new Set(finalIds)]);
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
    setPendingDeleteIds([]);
    setMenuOpen(false);
    setIsDeleteConfirmArmed(false);
    setIsAddingTag(false);
    setNewTagValue("");
  };

  const menuMaxHeight =
    pendingDeleteIds.length > 0 && isDeleteConfirmArmed ? "300px" : "240px";

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
          maxHeight={menuMaxHeight}
          overflow="hidden"
          minW="0"
          px="10px"
          py="2px"
        >
          <Box
            maxH="180px"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {tags.map((tag) => {
              const isSelected = selectedIds.includes(tag.id);
              return (
                <MenuItem
                  key={tag.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (readOnly) return;
                    const nextSelected = isSelected
                      ? selectedIds.filter((id) => id !== tag.id)
                      : [...selectedIds, tag.id];
                    onTagsChange(nextSelected);
                  }}
                  isDisabled={readOnly}
                  bg={pendingDeleteIds.includes(tag.id) ? "#FFD2D2" : "white"}
                  px="10px"
                  py="2px"
                  fontSize="12px"
                  fontWeight="400"
                  borderRadius="4px"
                  my="6px"
                >
                  <HStack
                    justifyContent="space-between"
                    w="100%"
                    spacing={2}
                  >
                    <HStack spacing={3} flex="1" alignItems="center">
                      <Checkbox
                        isChecked={isSelected}
                        isDisabled={readOnly}
                        pointerEvents="none"
                      />
                      <Text>{tag.tagValue}</Text>
                    </HStack>

                    {!readOnly && (
                      <Button
                        as="span"
                        variant="ghost"
                        aria-label={`Delete ${tag.tagValue} tag`}
                        ml="auto"
                        p={0}
                        minW={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{ bg: "transparent" }}
                        _active={{ bg: "transparent" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(tag)(e);
                        }}
                      >
                        <Icon as={MdDeleteOutline} boxSize="20px" />
                      </Button>
                    )}
                  </HStack>
                </MenuItem>
              );
            })}

            {isAddingTag ? (
              <HStack
                px={3}
                py={2}
                gap={0}
              >
                <Input
                  placeholder="New tag"
                  value={newTagValue}
                  onChange={(e) => setNewTagValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSave();
                    }
                  }}
                  isDisabled={readOnly || isDeletingTags}
                  variant="outline"
                  fontFamily={"Inter"}
                  fontStyle={"normal"}
                  lineHeight={"20px"}
                  fontSize="12px"
                  fontWeight={"400"}
                  color="black"
                  border={"1px solid var(--gray-200, #E2E8F0)"}
                  borderRadius="4px"
                  w="100%"
                  h="30px"
                  padding={"10px"}
                  margin={"0"}
                  _placeholder={{ color: "#A0AEC0" }}
                  autoFocus
                />
              </HStack>
            ) : (
              <MenuItem
                onClick={() => {
                  if (readOnly || isDeletingTags) return;
                  setIsAddingTag(true);
                }}
                isDisabled={readOnly || isDeletingTags}
                bg="white"
                px="15px"
                py="10px"
                fontSize="12px"
                fontWeight="400"
                borderRadius="4px"
                my="6px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={"6px"}
                opacity={readOnly || isDeletingTags ? 0.4 : 1}
              >
                <Text>Add Tag</Text>
                <AddIcon />
              </MenuItem>
            )}
          </Box>

          <HStack
            pt={2}
            px={0}
            pb={1}
            gap={1}
            borderColor="gray.200"
            flexDirection="column"
            alignItems="stretch"
          >
            {pendingDeleteIds.length > 0 && isDeleteConfirmArmed && (
              <Text
                color="red.500"
                fontSize="10px"
                lineHeight="1.1"
              >
                Are you sure? This is going to be deleted for all providers.
              </Text>
            )}
            <HStack py={1} gap="30px">
              <Button
                width="55px"
                height="24px"
                fontSize="12px"
                fontWeight="600"
                variant="ghost"
                onClick={handleCancel}
                flex={1}
                border="1px solid var(--gray-200, #E2E8F0)"
                borderRadius="4px"
                padding="0 8px"
              >
                Cancel
              </Button>
              <Button
                width="55px"
                height="24px"
                fontSize="12px"
                fontWeight="600"
                onClick={pendingDeleteIds.length > 0 ? handleDeleteAction : handleSave}
                isDisabled={!isDifferent}
                opacity={isDifferent ? 1 : 0.4}
                bg={pendingDeleteIds.length > 0 ? "#63171B" : "#3182CE"}
                color="white"
                flex={1}
                borderRadius="4px"
                padding="0 8px"
              >
                {pendingDeleteIds.length > 0
                  ? isDeleteConfirmArmed
                    ? "Confirm"
                    : "Delete"
                  : "Save"}
              </Button>
            </HStack>
          </HStack>
        </MenuList>
      </Menu>
    </VStack>
  );
};

export default TagSelect;
