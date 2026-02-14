import React, { useEffect, useState } from "react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { backend } = useBackendContext();
  const { role, loading } = useUserContext();
  


  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const res = await backend.get("/directoryCategories");
        // IMPORTANT: match your backend field name exactly
        const sorted = [...res.data].sort(
          (a, b) => a.columnOrder - b.columnOrder
        );

        setCategories(sorted);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [isOpen, backend]);
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
      // Separate existing and new categories
      const existingCategories = categories.filter((cat) => !String(cat.id).startsWith("temp-"));
      const newCategories = categories.filter((cat) => String(cat.id).startsWith("temp-"));

      // Update existing categories with new column order
      await Promise.all(
        existingCategories.map((cat, index) =>
          backend.put(`/directoryCategories/${cat.id}`, {
            columnOrder: index,
          })
        )
      );

      // Post new categories
      await Promise.all(
        newCategories.map((cat, index) =>
          backend.post("/directoryCategories", {
            name: cat.name,
            inputType: cat.inputType,
            isRequired: cat.isRequired,
            columnOrder: existingCategories.length + index,
          })
        )
      );

      onClose();
      setName("");
      setInputType("");
      setIsRequired(false);
      setShowForm(false);

      if (typeof onSaved === "function") {
        onSaved();
      }
    } catch (err) {
      console.error(
        "Failed to save changes",
        err?.response?.status,
        err?.response?.data || err.message
      );
    }
  };

  function SortableCategory({ category }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: category.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      padding: "8px",
      borderRadius: "6px",
      marginBottom: "4px",
      background: "#f3f3f3",
      cursor: "grab",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {category.name}
      </div>
    );
  }
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Manage Categories</DrawerHeader>
          <DrawerBody>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((cat) => cat.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((cat) => (
                  <SortableCategory
                    key={cat.id}
                    category={cat}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button onClick={() => setShowForm(!showForm)}>Add Category</Button>

            {showForm && (
              <Stack gap={4} mt={4} p={4} borderWidth={1} borderRadius={6}>
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

                <Stack direction="row" justify="flex-end">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddCategory}>
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
              onClick={onClose}
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
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CategoryDrawer;
