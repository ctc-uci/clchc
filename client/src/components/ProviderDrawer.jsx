import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Input,
  Select,
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
const ProviderDrawer = () => {
  const [formValues, setFormValues] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const { backend } = useBackendContext();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const handleInputChange = (categoryId, value) => {
  setFormValues((prev) => ({
    ...prev,
    [categoryId]: value,
  }));
  };

  useEffect(() => {
  if (!isOpen) return;

  const fetchDirectoryCategories = async () => {
    try {
      const response = await backend.get("/directoryCategories");
      console.log("DIRECTORY CATEGORIES:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching directory categories", err);
    }
  };
  fetchDirectoryCategories();

}, [isOpen, backend]);
useEffect(() => {
  if (!isOpen) return;

  const fetchTags = async () => {
    try {
      const response = await backend.get("/tags");
      console.log("ALL TAGS:", response.data);
      setTags(response.data);
    } catch (err) {
      console.error("Error fetching tags", err);
    }
  };

  fetchTags();
}, [isOpen, backend]);

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Provider Drawer</DrawerHeader>
          <DrawerBody>
            {categories.map((cat) => {
                const categoryTags = tags.filter(
                (tag) => tag.categoryId === cat.id
                );
            return (
              <div key={cat.id} style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: 500 }}>
                  {cat.name}
                  {cat.isRequired && " *"}
                </div>

                {cat.inputType === "text" && (
                  <Input
                    placeholder={cat.name}
                    value={formValues[cat.id] || ""}
                    onChange={(e) =>
                      handleInputChange(cat.id, e.target.value)
                    }
                  />
                )}

                {cat.inputType === "tag" && (
                  <Select
                  placeholder={`Select ${cat.name}`}
                  value={formValues[cat.id] || ""}
                  onChange={(e) =>
                    handleInputChange(cat.id, e.target.value)
                  }
                >
                  {categoryTags.map((tag) => (
                    <option key={tag.id} value={tag.tagValue}>
                      {tag.tagValue}
                    </option>
                  ))}
                  </Select>
                )}
              </div>
            );
          })}
        </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default ProviderDrawer;