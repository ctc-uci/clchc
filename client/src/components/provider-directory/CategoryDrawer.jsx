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
  Input,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [columnOrder, setColumnOrder] = useState(0);
  const { backend } = useBackendContext();
  const { role, loading } = useRoleContext();

  useEffect(() => {
    console.log("CategoryDrawer role context:", { loading, role, isOpen });
  }, [loading, role, isOpen]);


  const handleSubmit = async () => {
    try {
      console.log(role);
      const dateCreated = new Date().toISOString();
      const res = await backend.post("/directoryCategories", {
        name,
        inputType,
        isRequired,
        dateCreated,
        columnOrder,
      });
      console.log("Create response:", res?.data);

      onClose();
      setName("");
      setInputType("");
      setIsRequired(false);
      setColumnOrder(0);
      if (typeof onSaved === "function") {
        onSaved(res?.data);
      }
    } catch (err) {
      // console.error("Failed to create category", err);
      console.error("Failed to create category", err?.response?.status, err?.response?.data || err.message);
    }
  };

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
          <DrawerHeader>Provider Drawer</DrawerHeader>
          <DrawerBody>
            <Stack gap={4}>

               <FormControl isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <RadioGroup
                onChange={setInputType}
                value={inputType}
              >
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="tag">Tag</Radio>
                </Stack>
              </RadioGroup>

              <label>
                {" "}
                Optional?
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
              </label>

              <FormControl isRequired>
                <FormLabel>Column Order</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setColumnOrder(Number(e.target.value))}
                />
              </FormControl>
            </Stack>
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
