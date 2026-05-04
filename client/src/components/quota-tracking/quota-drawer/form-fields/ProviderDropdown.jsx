import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
} from "@chakra-ui/react";

import CustomSelect from "@/components/common/CustomSelect";
import { LockRightElement } from "../tools/shared";

export function ProviderDropdown({ providers = [], providerId, setProviderId, isLocked, isInvalid }) {
  const selectedProvider = providers.find(
    (provider) => String(provider.id) === String(providerId)
  );

  const options = providers.map((p) => ({ value: String(p.id), label: p.name }));

  const fixedInputProps = {
    bg: isLocked ? "gray.50" : "white",
    color: "gray.700",
    display: "flex",
    w: "100%",
    padding: "5px 8px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "2px",
    border: isInvalid ? "1px solid #FC8181" : "1px solid var(--gray-200, #E2E8F0)",
    background: isLocked ? "var(--gray-50, #F7FAFC)" : "var(--white, #FFF)",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "normal",
  };

  return (
    <FormControl
      isRequired
      isDisabled={isLocked}
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Provider
      </FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            {...fixedInputProps}
            pr="2.25rem"
          >
            {selectedProvider?.name ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <CustomSelect
          options={options}
          value={String(providerId ?? "")}
          setValue={setProviderId}
          isSearchable
          placeholder="Select provider"
          styleProps={fixedInputProps}
        />
      )}
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
