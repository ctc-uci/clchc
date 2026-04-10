import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Select,
} from "@chakra-ui/react";

import { selectStyles, TYPE_OPTIONS } from "../tools/constants";
import { LockRightElement } from "../tools/shared";

export const TypeInput = ({ type, setType, isLocked }) => {
  return (
    <FormControl
      w="43%"
      isDisabled={isLocked}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Type</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {type}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <InputGroup>
          <Select
            {...selectStyles}
            fontSize="14px"
            placeholder=" "
            pr={isLocked ? "2.25rem" : undefined}
            value={type ?? ""}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPE_OPTIONS.map(({ value, label }) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </Select>
          {isLocked && <LockRightElement />}
        </InputGroup>
      )}
    </FormControl>
  );
};
