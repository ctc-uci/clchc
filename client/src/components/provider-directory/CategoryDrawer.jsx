import React, { useEffect, useRef, useState } from "react";

import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
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
      borderRadius="md"
      bg="gray.100"
      mb={3}
    >
      {/* Drag Handle ONLY */}
      <Flex
        align="center"
        bg="gray.200"
        px={4}
        py={3}
        {...attributes}
        {...listeners}
        cursor="grab"
        _active={{ cursor: "grabbing" }}
      >
        <HamburgerIcon />
      </Flex>

      {/* Category Name */}
      <Box
        flex="1"
        px={4}
      >
        {category.name}
      </Box>

      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete category"
        variant="ghost"
        mr={2}
        onClick={() => onDelete(category.id)}
      />
    </Flex>
  );
}

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const toast = useToast();
  const formStackRef = useRef(null);
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const pendingCloseRef = useRef(false);
  const { data: serverCategories = [], isLoading } = useDirectoryCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const sorted = [...serverCategories].sort(
          (a, b) => a.columnOrder - b.columnOrder
        );

        setCategories(sorted);
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

  // alert pop ups for discarding unsaved changes
  const handleDrawerClose = () => {
    const hasTempCategories = categories.some((cat) =>
      String(cat.id).startsWith("temp-")
    );
    if (hasTempCategories) {
      pendingCloseRef.current = true;
      onDiscardAlertOpen();
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    onDiscardAlertClose();
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
    setInputType("");
    setIsRequired(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      for (const id of deletedIds) {
        if (!String(id).startsWith("temp-")) {
          await deleteCategory(id);
        }
      }

      const existingCategories = categories.filter(
        (cat) => !String(cat.id).startsWith("temp-")
      );
      const newCategories = categories.filter((cat) =>
        String(cat.id).startsWith("temp-")
      );

      await Promise.all(
        existingCategories.map((cat, index) =>
          updateCategory({ id: cat.id, categoryData: { columnOrder: index } })
        )
      );

      await Promise.all(
        newCategories.map((cat) =>
          createCategory({
            name: cat.name,
            inputType: cat.inputType,
            isRequired: cat.isRequired,
            columnOrder: cat.columnOrder,
          })
        )
      );

      onClose();
      setDeletedIds([]);
      setName("");
      setInputType("");
      setIsRequired(false);
      setShowForm(false);

      // feedback for successfully saving categories
      toast({
        title: "Success",
        description: "Categories saved successfully!",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });

      if (typeof onSaved === "function") {
        onSaved();
      }
    } catch (err) {
      // feedback for error + deleting the bad category
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => !String(cat.id).startsWith("temp-"))
      );

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
    setDeletedIds((prev) => [...prev, id]);
  }
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={handleDrawerClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Manage Categories</DrawerHeader>
          {isLoading ? (
            <SkeletonBody />
          ) : (
            <>
              <DrawerBody>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
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

                <Button onClick={() => setShowForm(!showForm)}>
                  Add Category
                </Button>

                {showForm && (
                  <Stack
                    gap={4}
                    mt={4}
                    p={4}
                    borderWidth={1}
                    borderRadius={6}
                    ref={formStackRef}
                  >
                    <FormControl isRequired>
                      <FormLabel>Category Name</FormLabel>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Input Type</FormLabel>
                      <RadioGroup
                        onChange={setInputType}
                        value={inputType}
                      >
                        <Stack direction="row">
                          <Radio value="text">Text</Radio>
                          <Radio value="tag">Tag</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    <label>
                      {" "}
                      Optional?
                      <input
                        type="checkbox"
                        style={{ marginLeft: "8px" }}
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                      />
                    </label>

                    <Stack
                      direction="row"
                      justify="flex-end"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        colorScheme="blue"
                        onClick={handleAddCategory}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </DrawerBody>

              <DrawerFooter>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={handleDrawerClose}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isDiscardAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDiscardAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              Discard Changes
            </AlertDialogHeader>
            <AlertDialogBody>
              You have unsaved categories. Are you sure you want to discard
              these changes?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onDiscardAlertClose}
              >
                Keep Changes
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDiscard}
                ml={3}
              >
                Discard
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CategoryDrawer;
