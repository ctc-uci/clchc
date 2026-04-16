import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Skeleton,
} from "@chakra-ui/react";

import CustomSelect from "@/components/common/CustomSelect";
import { useProvidersSummary } from "@/contexts/hooks/data-fetching/useProviders";

import { LockRightElement } from "../tools/shared";

export function ProviderDropdown({ providers = [], providerId, setProviderId, isLocked, isInvalid }) {
  // const { data: providers = [], isLoading: loadingSummary } =
  //   useProvidersSummary();

  // if (loadingSummary) {
  //   return (
  //     <>
  //       <Skeleton
  //         height="16px"
  //         mb={2}
  //       />
  //       <Skeleton height="40px" />
  //     </>
  //   );
  // }

  const options = providers.map((p) => ({
    value: String(p.id),
    label: p.name,
  }));
  const selectedProvider = providers.find(
    (provider) => String(provider.id) === String(providerId)
  );

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
            {selectedProvider?.name ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <CustomSelect
          options={options}
          value={providerId === "" ? "" : String(providerId)}
          setValue={(val) => setProviderId(Number(val))}
          styleProps={isInvalid ? { border: "1px solid #FC8181" } : {}}
        />
      )}
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
