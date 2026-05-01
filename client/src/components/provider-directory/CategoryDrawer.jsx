import React, { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Text,
  useToast,
  VStack,
  Checkbox
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
  MdInfoOutline,
  MdLocalOffer,
  MdLock,
  MdMenu,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdTag,
} from "react-icons/md";
import { HiMinusSm } from "react-icons/hi";
import { BsTextareaT } from "react-icons/bs";

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

function SortableCategory({ category, onDelete, isPendingDelete, isPendingCreate, isDeleteDisabled }) {
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
      bg={isPendingDelete ? "#FFD2D2" : isPendingCreate ? "#92CAFD" : "white"}
      mb={3}
      height="48px"
      borderRadius="6px"
    >
      <Flex
        align="center"
        bg={isPendingDelete ? "#8B0000" : isPendingCreate ? "#0052CE" : "#EDF2F7"}
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
          color={isPendingDelete || isPendingCreate ? "white" : "#000000"}
        />
      </Flex>
      <Flex
        borderRadius="0 6px 6px 0"
        border={isPendingDelete ? "1px solid #CE0000" : isPendingCreate ? "1px solid #0052CE" : "1px solid #E2E8F0"}
        width="100%"
        height="100%"
        align="center"
        position="relative"
      >
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
            color={isPendingDelete ? "#8B0000" : isPendingCreate ? "#0052CE" : "inherit"}
          >
            {category.name}
          </Text>
          <Text
            fontWeight="400"
            fontStyle="normal"
            fontSize="8px"
            color={isPendingDelete ? "#CE0000" : isPendingCreate ? "#0052CE" : "#0000007A"}
          >
            {category.inputType === "text" ? "Plain Text" : "Tags"}{" "}
          </Text>
        </VStack>

        <IconButton
          icon={<MdDelete />}
          aria-label="Delete category"
          variant="ghost"
          position="absolute"
          right="8px"
          top="50%"
          transform="translateY(-50%)"
          color={isPendingDelete ? "#CE0000" : "inherit"}
          _hover={{ bg: "transparent", boxShadow: "none" }}
          _focus={{ boxShadow: "none" }}
          isDisabled={isDeleteDisabled}
          opacity={isDeleteDisabled ? 0.3 : 1}
          onClick={() => onDelete(category.id)}
        />
      </Flex>
    </Flex>
  );
}

const LOCKED_COLUMNS = [
  { name: "Provider", position: "first" },
  { name: "NPI/License", position: "first" },
  { name: "Long Term Notes", position: "last" },
];

function LockedCategory({ name }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      bg="white"
      mb={3}
      height="48px"
      borderRadius="6px"
      opacity={0.5}
    >
      <Flex
        align="center"
        bg="#EDF2F7"
        px={4}
        py={3}
        borderRadius="6px 0 0 6px"
        height="100%"
        cursor="not-allowed"
      >
        <MdLock size="18px" color="#718096" />
      </Flex>
      <Flex
        borderRadius="0 6px 6px 0"
        border="1px solid #E2E8F0"
        width="100%"
        height="100%"
        align="center"
        position="relative"
      >
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
            color="inherit"
          >
            {name}
          </Text>
          <Text
            fontWeight="400"
            fontStyle="normal"
            fontSize="8px"
            color="#0000007A"
          >
            Locked
          </Text>
        </VStack>
        <IconButton
          icon={<MdDelete />}
          aria-label="Delete category"
          variant="ghost"
          position="absolute"
          right="8px"
          top="50%"
          transform="translateY(-50%)"
          isDisabled
          opacity={0.3}
        />
      </Flex>
    </Flex>
  );
}

const inputTypeOptions = [
  {
    value: "tag",
    label: "Tag (Default)",
    buttonLabel: "Tag",
    icon: MdLocalOffer,
  },
  {
    value: "text",
    label: "Plain Text",
    buttonLabel: "Plain Text",
    icon: BsTextareaT,
  },
];

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("tag");
  const [isRequired, setIsRequired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [inputTypeMenuOpen, setInputTypeMenuOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [deletePhase, setDeletePhase] = useState(null); // null | "confirming"
  const [createPhase, setCreatePhase] = useState(null); // null | "confirming"
  const [hasReordered, setHasReordered] = useState(false);
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
    setPendingDeleteIds([]);
    setDeletePhase(null);
    setCreatePhase(null);
    setHasReordered(false);
    setNameError(false);
  };

  // Reset local state when drawer opens
  useEffect(() => {
    if (isOpen) resetLocalState();
  }, [isOpen]);

  // Sync categories from server whenever serverCategories updates (including after save)
  useEffect(() => {
    if (!isOpen) return;
    const sorted = [...serverCategories].sort(
      (a, b) => a.columnOrder - b.columnOrder
    );
    setCategories(sorted);
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

    setHasReordered(true);
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
    if (!name.trim()) {
      setNameError(true);
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

    setCategories((prev) => [...prev, newCategory]);
    setName("");
    setInputType("tag");
    setIsRequired(false);
    setNameError(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    const hasNewCategories = categories.some((cat) =>
      String(cat.id).startsWith("temp-")
    );
    if (!hasNewCategories && !hasReordered && deletePhase !== "confirming") {
      onClose();
      return;
    }

    try {
      const idsToDelete = pendingDeleteIds.filter(
        (id) => !String(id).startsWith("temp-")
      );
      const pendingDeleteSet = new Set(pendingDeleteIds);

      const deletedNames = categories
        .filter((cat) => pendingDeleteSet.has(cat.id))
        .map((cat) => cat.name);

      for (const id of idsToDelete) {
        await deleteCategory(id);
      }

      const categoriesToPersist = categories.filter(
        (cat) => !pendingDeleteSet.has(cat.id)
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

      newCategories.forEach((cat) => {
        toast({
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
          render: ({ onClose }) => (
            <Alert
              status="success"
              borderBottom="4px solid #0C824D"
              boxShadow="md"
              pr={8}
              position="relative"
            >
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="14px" fontWeight="700">Category Created</AlertTitle>
                <AlertDescription fontSize="13px" >
                  You have created the new category &ldquo;{cat.name}&rdquo;.
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right={2} top={2} size="sm" onClick={onClose} />
            </Alert>
          ),
        });
      });

      deletedNames.forEach((name) => {
        toast({
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
          render: ({ onClose }) => (
            <Alert
              status="error"
              borderBottom="4px solid #90080F"
              boxShadow="md"
              pr={8}
              position="relative"
            >
              <AlertIcon />
              <Box gap = {0}>
                <AlertTitle fontSize="14px" fontWeight="700">Category Deletion</AlertTitle>
                <AlertDescription fontSize="13px">
                  You have deleted the category &ldquo;{name}&rdquo;.
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right={2} top={2} size="sm" onClick={onClose} />
            </Alert>
          ),
        });
      });

      const wasReorderOnly = hasReordered && deletePhase !== "confirming" && !categories.some((cat) => String(cat.id).startsWith("temp-"));
      resetLocalState();

      if (wasReorderOnly) onClose();

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
    setPendingDeleteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setDeletePhase(null);
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
                {(createPhase === "confirming" || deletePhase === "confirming") && (
                  <Box
                    bg={deletePhase === "confirming" ? "#FFD2D2" : "#92CAFD"}
                    borderRadius="8px"
                    p={4}
                    mb={4}
                    mt={2}
                    border={`2px solid ${deletePhase === "confirming" ? "#CE0000" : "#0052CE"}`}
                  >
                    <VStack
                      align="flex-start"
                      mb={3}
                    >
                      <HStack
                        align="start"
                        spacing={1}
                        alignItems="center"
                      >
                        <Icon
                          as={MdInfoOutline}
                          color={deletePhase === "confirming" ? "#CE0000" : "#0052CE"}
                          boxSize="25px"
                          mt="1px"
                          flexShrink={0}
                        />
                        <Text
                          fontWeight="500"
                          color={deletePhase === "confirming" ? "#CE0000" : "#0052CE"}
                          fontSize="20px"
                        >
                          Notification
                        </Text>
                      </HStack>
                      <Text
                        color={deletePhase === "confirming" ? "#CE0000" : "#0052CE"}
                        fontSize="18px"
                        fontWeight="400"
                      >
                        Please confirm you would like to{" "}
                        <Text as="span" fontWeight="700">
                          {deletePhase === "confirming" ? "delete" : "create"}
                        </Text>{" "}
                        {deletePhase === "confirming"
                          ? pendingDeleteIds.length > 1
                            ? `these ${pendingDeleteIds.length} categories`
                            : "this category"
                          : "a new category with the following information"}
                        .
                      </Text>
                    </VStack>
                  </Box>
                )}

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
                    {LOCKED_COLUMNS.filter((c) => c.position === "first").map((col) => (
                      <LockedCategory key={col.name} name={col.name} />
                    ))}
                    <SortableContext
                      items={categories.map((cat) => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categories.map((cat) => (
                        <SortableCategory
                          key={cat.id}
                          category={cat}
                          onDelete={handleMarkForDelete}
                          isPendingDelete={pendingDeleteIds.includes(cat.id)}
                          isPendingCreate={String(cat.id).startsWith("temp-")}
                          isDeleteDisabled={categories.some((c) => String(c.id).startsWith("temp-")) || deletePhase === "confirming" || createPhase === "confirming"}
                        />
                      ))}
                    </SortableContext>
                    {LOCKED_COLUMNS.filter((c) => c.position === "last").map((col) => (
                      <LockedCategory key={col.name} name={col.name} />
                    ))}
                  </DndContext>

                  {!showForm && (
                    <Button
                      onClick={() => setShowForm(!showForm)}
                      width="100%"
                      bg="#EDF2F7"
                      borderRadius="10px"
                      fontWeight="400"
                      fontStyle="normal"
                      fontSize="16px"
                      maxHeight="40px"
                      isDisabled={pendingDeleteIds.length > 0 || createPhase === "confirming" || deletePhase === "confirming"}
                    >
                      + Add New Category
                    </Button>
                  )}

                  {showForm && pendingDeleteIds.length === 0 && createPhase !== "confirming" && deletePhase !== "confirming" && (
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
                            borderRadius="2px"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (nameError) setNameError(false);
                            }}
                            borderColor={nameError ? "#E53E3E" : undefined}
                            _hover={{
                              borderColor: nameError ? "#E53E3E" : undefined,
                            }}
                            height="36px"
                          />
                          {nameError && (
                            <Text
                              fontSize="12px"
                              color="red.400"
                              mt={1}
                            >
                              Please fill out category name.
                            </Text>
                          )}
                        </FormControl>
                        <Flex
                          as="label"
                          alignItems="center"
                          width="50%"
                          justify="center"
                          gap="6px"
                          cursor="pointer"
                        >
                          <Checkbox
                            isChecked={!isRequired}
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
                                )?.buttonLabel ?? "Select type"}
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
                                    <Text
                                      fontWeight={400}
                                      fontSize="14px"
                                    >
                                      {option.label}
                                    </Text>
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
                          onClick={() => setShowForm(false)}
                          width="122px"
                          height="40px"
                          fontSize="16px"
                          fontWeight="400"
                          borderRadius="10px"
                          leftIcon={<Icon as={HiMinusSm} boxSize="24px" />}
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

              <DrawerFooter
                justifyContent="space-between"
                gap="20px"
                w="100%"
                bg="white"
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    if (createPhase === "confirming" || deletePhase === "confirming") {
                      setCreatePhase(null);
                      setDeletePhase(null);
                    } else {
                      handleDrawerClose();
                    }
                  }}
                  width="50%"
                  color="#022442"
                  borderColor="#0000003D"
                  _hover={{ bg: "gray.100" }}
                  borderRadius="4px"
                  fontFamily="Inter"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="600"
                  lineHeight="28px"
                  padding="10px"
                >
                  {createPhase === "confirming" || deletePhase === "confirming" ? "Back to Editing" : "Cancel"}
                </Button>
                <Button
                  variant={pendingDeleteIds.length > 0 && deletePhase !== "confirming" ? "outline" : "solid"}
                  bg={
                    deletePhase === "confirming"
                      ? "red.700"
                      : pendingDeleteIds.length > 0
                      ? "transparent"
                      : createPhase === "confirming"
                      ? "#113D64"
                      : "#929292"
                  }
                  color={pendingDeleteIds.length > 0 && deletePhase !== "confirming" ? "#90080F" : "white"}
                  borderColor={pendingDeleteIds.length > 0 && deletePhase !== "confirming" ? "#90080F" : undefined}
                  _hover={{
                    bg: deletePhase === "confirming" || pendingDeleteIds.length > 0 ? "red.800" : "#1a4f7a",
                    color: pendingDeleteIds.length > 0 && deletePhase !== "confirming" ? "#FFF" : undefined,
                  }}
                  width="50%"
                  onClick={() => {
                    if (pendingDeleteIds.length > 0 && deletePhase !== "confirming") {
                      setShowForm(false);
                      setDeletePhase("confirming");
                    } else if (categories.some((c) => String(c.id).startsWith("temp-")) && createPhase !== "confirming") {
                      setShowForm(false);
                      setCreatePhase("confirming");
                    } else {
                      handleSubmit();
                    }
                  }}
                  borderRadius="4px"
                  fontFamily="Inter"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="600"
                  lineHeight="28px"
                  padding="10px"
                  isDisabled={!hasReordered && pendingDeleteIds.length === 0 && !categories.some((cat) => String(cat.id).startsWith("temp-"))}
                >
                  {deletePhase === "confirming"
                    ? "Confirm Delete"
                    : pendingDeleteIds.length > 0
                    ? "Delete"
                    : hasReordered
                    ? "Save Changes"
                    : "Confirm"}
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
