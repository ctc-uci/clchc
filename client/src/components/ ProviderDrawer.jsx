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
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
const ProviderDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const { backend } = useBackendContext();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

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

        {categories.map((cat) => (
            <div key={cat.id}>
            {cat.name} ({cat.inputType}) ({cat.required ? "required" : "optional"})
            </div>
        ))}
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