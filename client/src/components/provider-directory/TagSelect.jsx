import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
} from "@chakra-ui/react";

import { ChevronDown } from "lucide-react";

import { useTagsContext } from "./tags/TagsContext";

const TagSelect = ({ tags, selectedTags, onTagsChange, readOnly }) => {
  const { tagsMap } = useTagsContext();

  const handleRemoveTag = (tagId) => (e) => {
    e.stopPropagation();
    if (readOnly) {
      return;
    }
    const nextTags = selectedTags.filter((id) => id !== tagId);
    onTagsChange(nextTags);
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
        {selectedTags.map((tagId) => {
          if (!tagId) return; // TODO: Check db, why is this sometimes undefined?
          console.log(tagId);
          return (
            <Tag
              size="sm"
              key={tagId}
              borderRadius="full"
              variant="solid"
              backgroundColor="black"
            >
              <TagLabel>{tagsMap[tagId]?.tagValue || ""}</TagLabel>
              {!readOnly && <TagCloseButton onClick={handleRemoveTag(tagId)} />}
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
                {tag.tagValue}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </VStack>
  );
};

export default TagSelect;
