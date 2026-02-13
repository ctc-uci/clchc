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

const CategoryDrawer = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [columnOrder, setColumnOrder] = useState(0);
  const { backend } = useBackendContext();
  const { role, loading } = useUserContext();

  const handleSubmit = async () => {
    try {
      const dateCreated = new Date().toISOString();
      const adjustedColumnOrder = columnOrder - 1;
      const res = await backend.post("/directoryCategories", {
        name,
        inputType,
        isRequired,
        dateCreated,
        columnOrder: adjustedColumnOrder,
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
      console.error(
        "Failed to create category",
        err?.response?.status,
        err?.response?.data || err.message
      );
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
