import { Button, DrawerFooter, Stack } from "@chakra-ui/react";

export const QuotaDrawerFooter = ({
  isLocked,
  setIsLocked,
  setAction,
  action,
  quotaID,
  handleSubmit,
  handleClose,
}) => {
  return (
    <DrawerFooter
      position="absolute"
      bottom={0}
      w="100%"
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <Stack
        direction="row"
        justify="space-between"
        w="100%"
        gap="20px"
      >
        {isLocked ? (
          <>
            <Button
              type="button"
              variant="outline"
              px={10}
              width="50%"
              onClick={() => {
                setIsLocked(false);
                setAction("");
              }}
              borderRadius="4px"
              borderColor="#0000003D"
            >
              Continue Editing
            </Button>

            <Button
              type="submit"
              px={10}
              width="50%"
              bg="black"
              color="white"
              borderRadius="4px"
            >
              {action === "delete" ? "Delete" : "Confirm"}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              px={10}
              width="50%"
              onClick={(e) => {
                if (!quotaID) {
                  handleClose();
                  return;
                }
                handleSubmit(e, "delete");
              }}
              borderRadius="4px"
              borderColor="#0000003D"
            >
              {!quotaID ? "Cancel" : "Delete Quota"}
            </Button>

            <Button
              px={10}
              width="50%"
              bg="#113D64"
              color="white"
              borderRadius="4px"
              onClick={(e) => {
                handleSubmit(e, "save");
              }}
            >
              {!quotaID ? "Create" : "Save Changes"}
            </Button>
          </>
        )}
      </Stack>
    </DrawerFooter>
  );
};
