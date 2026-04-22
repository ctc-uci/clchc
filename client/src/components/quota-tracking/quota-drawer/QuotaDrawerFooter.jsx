import { Button, DrawerFooter, Stack } from "@chakra-ui/react";

export const QuotaDrawerFooter = ({
  isLocked,
  setIsLocked,
  setAction,
  action,
  quotaID,
  handleSubmit,
  handleClose,
  isLocationDifferent,
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
              width="50%"
              onClick={() => {
                setIsLocked(false);
                setAction("");
              }}
              borderRadius="4px"
              color="#022442"
              borderColor="#0000003D"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="28px"
              padding="10px"
            >
              Back to Editing
            </Button>

            <Button
              type="submit"
              width="50%"
              bg={action === "delete" ? "red.700" : "#113D64"}
              color="white"
              _hover={{ bg: action === "delete" ? "red.800" : "#1a4f7a" }}
              borderRadius="4px"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="28px"
              padding="10px"
              isDisabled={isLocationDifferent}
            >
              {action === "delete" ? "Delete" : "Confirm"}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              width="50%"
              onClick={(e) => {
                if (!quotaID) {
                  handleClose();
                  return;
                }
                handleSubmit(e, "delete");
              }}
              borderRadius="4px"
              color={quotaID ? "#90080F" : "#022442"}
              borderColor={quotaID ? "#90080F" : "#0000003D"}
              _hover={quotaID ? { bg: "red.800", color: "#FFF" } : { bg: "gray.100" }}
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="28px"
              padding="10px"
            >
              {!quotaID ? "Cancel" : "Delete Quota"}
            </Button>

            <Button
              width="50%"
              bg="#929292"
              color="white"
              _hover={{ bg: "#1a4f7a" }}
              borderRadius="4px"
              onClick={(e) => {
                handleSubmit(e, "save");
              }}
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="28px"
              padding="10px"
              isDisabled={isLocationDifferent}
            >
              {!quotaID ? "Create" : "Save Changes"}
            </Button>
          </>
        )}
      </Stack>
    </DrawerFooter>
  );
};
