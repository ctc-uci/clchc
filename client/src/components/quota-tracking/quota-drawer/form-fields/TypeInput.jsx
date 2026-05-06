import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";

import CustomSelect from "@/components/common/CustomSelect";

import { TYPE_OPTIONS } from "../tools/constants";

export const TypeInput = ({ type, setType, isLocked, isInvalid }) => {
  return (
    <FormControl
      isRequired
      w="43%"
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Type
      </FormLabel>
      <CustomSelect
        options={TYPE_OPTIONS}
        value={type ?? ""}
        setValue={setType}
        isReadOnly={isLocked}
        styleProps={isInvalid ? { border: "1px solid #FC8181" } : {}}
      />
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
};
