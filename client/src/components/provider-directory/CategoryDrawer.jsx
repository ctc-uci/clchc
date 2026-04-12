import React, { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import {
  useCreateCategory,
  useDeleteCategory,
  useDirectoryCategories,
  useUpdateCategory,
} from "@/contexts/hooks/data-fetching/useDirectoryCategories";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdCheck,
  MdDelete,
  MdLocalOffer,
  MdMenu,
  MdOutlineHorizontalRule,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdTag,
  MdTextFields,
} from "react-icons/md";

const SkeletonBody = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton
          key={i}
          height="15%"
          margin="20px"
        />
      ))}
    </>
  );
};

function SortableCategory({ category, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      align="center"
      justify="space-between"
      bg="white"
      mb={3}
      height="48px"
    >
      <Flex
        align="center"
        bg="#EDF2F7"
        px={4}
        py={3}
        {...attributes}
        {...listeners}
        cursor="grab"
        _active={{ cursor: "grabbing" }}
        borderRadius="6px 0 0 6px"
        height="100%"
      >
        <MdMenu
          size="18px"
          color="#000000"
        />
      </Flex>
      <Flex
        borderRadius="0 6px 6px 0"
        border="1px solid #E2E8F0"
        width="100%"
        height="100%"
        align="center"
        position="relative"
      >
        {/* Category Name */}
        <VStack
          pl="16px"
          pr="40px"
          py="4px"
          height="100%"
          align="start"
          gap={0}
        >
          <Text
            fontWeight="400"
            fontStyle="normal"
            fontSize="18px"
            mb={-1}
          >
            {category.name}
          </Text>
          <Text
            fontWeight="400"
            fontStyle="normal"
            fontSize="8px"
            color="#0000007A"
          >
            {category.inputType === "text" ? "Plain Text" : "Tags"}{" "}
          </Text>
        </VStack>

        <IconButton
          icon={<MdDelete size="18px" />}
          aria-label="Delete category"
          variant="ghost"
          position="absolute"
          right="8px"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => onDelete(category.id)}
        />
      </Flex>
    </Flex>
  );
}

const inputTypeOptions = [
  { value: "tag", label: "Tag (Default)", icon: MdLocalOffer },
  { value: "text", label: "Plain Text", icon: MdTextFields },
];

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("tag");
  const [isRequired, setIsRequired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [inputTypeMenuOpen, setInputTypeMenuOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const toast = useToast();
  const formStackRef = useRef(null);
  const { data: serverCategories = [], isLoading } = useDirectoryCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const resetLocalState = () => {
    setName("");
    setInputType("tag");
    setIsRequired(false);
    setShowForm(false);
    setInputTypeMenuOpen(false);
    setDeletedIds([]);
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const sorted = [...serverCategories].sort(
          (a, b) => a.columnOrder - b.columnOrder
        );

        setCategories(sorted);
        resetLocalState();
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [isOpen, serverCategories]);

  // after clicking add new category, it scrolls to show the new stack form shown
  useEffect(() => {
    if (showForm && formStackRef.current) {
      formStackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [showForm]);

  const handleDrawerClose = () => {
    setCategories([]);
    resetLocalState();
    onClose();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setCategories((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex);

      return reordered.map((item, index) => ({
        ...item,
        columnOrder: index,
      }));
    });
  };

  const handleAddCategory = () => {
    if (!name.trim() || !inputType) {
      return;
    }

    const newCategory = {
      id: `temp-${Date.now()}`,
      name,
      inputType,
      isRequired,
      columnOrder: categories.length,
      dateCreated: new Date().toISOString(),
    };

    setCategories([...categories, newCategory]);
    setName("");
    setInputType("tag");
    setIsRequired(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      const idsToDelete = deletedIds.filter(
        (id) => !String(id).startsWith("temp-")
      );
      const idsToDeleteSet = new Set(idsToDelete);

      for (const id of idsToDelete) {
        await deleteCategory(id);
      }

      const categoriesToPersist = categories.filter(
        (cat) => !idsToDeleteSet.has(cat.id)
      );
      const orderById = new Map(
        categoriesToPersist.map((cat, index) => [cat.id, index])
      );

      const existingCategories = categoriesToPersist.filter(
        (cat) => !String(cat.id).startsWith("temp-")
      );
      const newCategories = categoriesToPersist.filter((cat) =>
        String(cat.id).startsWith("temp-")
      );

      await Promise.all(
        existingCategories.map((cat) =>
          updateCategory({
            id: cat.id,
            categoryData: { columnOrder: orderById.get(cat.id) },
          })
        )
      );

      await Promise.all(
        newCategories.map((cat) =>
          createCategory({
            name: cat.name,
            inputType: cat.inputType,
            isRequired: cat.isRequired,
            columnOrder: orderById.get(cat.id),
          })
        )
      );

      // feedback for successfully saving categories
      toast({
        title: "Success",
        description: "Categories saved successfully!",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });

      setCategories([]);
      resetLocalState();
      onClose();

      if (typeof onSaved === "function") {
        onSaved();
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data || err.message || "Failed to save changes";
      console.error(
        "Failed to save changes",
        err?.response?.status,
        errorMessage
      );
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleMarkForDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setDeletedIds((prev) => {
      if (String(id).startsWith("temp-") || prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={handleDrawerClose}
      >
        <DrawerOverlay />
        <DrawerContent maxWidth="432px">
          <DrawerHeader
            borderBottom="1px solid #E2E8F0"
            width="100%"
            color="#113D64"
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            padding="32px"
          >
            <VStack
              width="100%"
              align="start"
              gap={0}
            >
              <Text
                fontSize="23px"
                fontWeight="500"
                fontStyle="medium"
              >
                Manage Categories
              </Text>
              <Text
                fontSize="16px"
                fontWeight="400"
                fontStyle="normal"
                color="#586771"
              >
                Add new categories or change their order.
              </Text>
            </VStack>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close"
              variant="ghost"
              onClick={handleDrawerClose}
              ml={2}
              size="sm"
            />
          </DrawerHeader>

          {isLoading ? (
            <SkeletonBody />
          ) : (
            <>
              <DrawerBody p="14px 28px 14px 28px">
                <Box
                  border="1px solid #E2E8F0"
                  p="12px"
                  mt={6}
                >
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[
                      restrictToVerticalAxis,
                      restrictToParentElement,
                    ]}
                  >
                    <SortableContext
                      items={categories.map((cat) => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categories.map((cat) => (
                        <SortableCategory
                          key={cat.id}
                          category={cat}
                          onDelete={handleMarkForDelete}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>

                  {!showForm && <Button
                    onClick={() => setShowForm(!showForm)}
                    width="100%"
                    bg="#EDF2F7"
                    borderRadius="10px"
                    fontWeight="400"
                    fontStyle="normal"
                    fontSize="16px"
                    maxHeight="40px"
                  >
                    + Add New Category
                  </Button>}

                  {showForm && (
                    <Stack
                      gap={4}
                      mt={4}
                      p={4}
                      borderWidth={1}
                      borderRadius="10px"
                      ref={formStackRef}
                      bg="#EDF2F7"
                    >
                      <Flex>
                        <FormControl
                          isRequired
                          width="50%"
                        >
                          <Input
                            bg="white"
                            type="text"
                            placeholder="Category Name"
                            // color="black"
                            borderRadius="2px"
                            // align="start"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            height="36px"
                          />
                        </FormControl>
                        <Flex
                          as="label"
                          alignItems="center"
                          width="50%"
                          justify="center"
                          gap="6px"
                          cursor="pointer"
                        >
                          <Radio
                            value="required"
                            isChecked={isRequired}
                            onChange={() => setIsRequired(!isRequired)}
                            border="2px solid #718096"
                          />
                          Optional?
                        </Flex>
                      </Flex>

                      <FormControl isRequired>
                        <Box>
                          <Button
                            rightIcon={
                              inputTypeMenuOpen ? (
                                <MdOutlineKeyboardArrowUp />
                              ) : (
                                <MdOutlineKeyboardArrowDown />
                              )
                            }
                            justifyContent="space-between"
                            bg="white"
                            border="1px solid #E2E8F0"
                            borderRadius="4px"
                            maxHeight="30px"
                            px={2}
                            width="30%"
                            minWidth="80px"
                            _hover={{ bg: "gray.50" }}
                            onClick={() => setInputTypeMenuOpen((o) => !o)}
                          >
                            <HStack
                              spacing={2}
                              overflow="hidden"
                              minW={0}
                            >
                              <Icon
                                boxSize="11px"
                                as={
                                  inputTypeOptions.find(
                                    (opt) => opt.value === inputType
                                  )?.icon || MdTag
                                }
                              />
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {inputTypeOptions.find(
                                  (opt) => opt.value === inputType
                                )?.label ?? "Select type"}
                              </Text>
                            </HStack>
                          </Button>

                          {inputTypeMenuOpen && (
                            <Box
                              mt={1}
                              borderRadius="4px"
                              border="1px solid #E2E8F0"
                              bg="white"
                              overflow="hidden"
                              width="50%"
                            >
                              <Text
                                px={2}
                                py={1}
                                fontSize="8px"
                                fontWeight="400"
                                color="#000000"
                              >
                                Category Types
                              </Text>
                              {inputTypeOptions.map((option) => (
                                <Flex
                                  key={option.value}
                                  px={4}
                                  py={1}
                                  justify="space-between"
                                  align="center"
                                  cursor="pointer"
                                  _hover={{ bg: "gray.50" }}
                                  onClick={() => {
                                    setInputType(option.value);
                                    setInputTypeMenuOpen(false);
                                  }}
                                >
                                  <HStack spacing={3}>
                                    <Icon as={option.icon} />
                                    <Text fontWeight={400} fontSize="14px">{option.label}</Text>
                                  </HStack>
                                  {inputType === option.value && (
                                    <Icon
                                      as={MdCheck}
                                      boxSize="8px"
                                    />
                                  )}
                                </Flex>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </FormControl>

                      <Stack
                        direction="row"
                        justify="space-between"
                      >
                        <Button
                          bg="white"
                          color="black"
                          // variant="outline"
                          onClick={() => setShowForm(false)}
                          width="122px"
                          height="40px"
                          fontSize="16px"
                          fontWeight="400"
                          borderRadius="10px"
                          leftIcon={<Icon as={MdOutlineHorizontalRule} />}
                        >
                          Discard
                        </Button>
                        <Button
                          bg="#022442"
                          color="white"
                          onClick={handleAddCategory}
                          width="122px"
                          height="40px"
                          fontSize="16px"
                          fontWeight="400"
                          borderRadius="10px"
                        >
                          + Create
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </Box>
              </DrawerBody>

              <DrawerFooter gap="2%">
                <Button
                  variant="outline"
                  mr={3}
                  onClick={handleDrawerClose}
                  width="48%"
                  border="1px solid black"
                  borderRadius="4px"
                  minHeight="48px"
                  fontSize="18px"
                  fontWeight="600"
                >
                  Cancel
                </Button>
                <Button
                  bg="#113D64"
                  color="white"
                  width="48%"
                  onClick={handleSubmit}
                  borderRadius="4px"
                  minHeight="48px"
                  fontSize="18px"
                  fontWeight="600"
                >
                  Confirm
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CategoryDrawer;
