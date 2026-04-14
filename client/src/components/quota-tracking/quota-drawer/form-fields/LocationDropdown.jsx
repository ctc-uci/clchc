import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Skeleton,
} from "@chakra-ui/react";

import CustomSelect from "@/components/common/CustomSelect";
import { useLocations } from "@/contexts/hooks/data-fetching/useLocations";

import { LockRightElement } from "../tools/shared";

export function LocationDropdown({ locationId, setLocationId, isLocked }) {
  const { data: locations = [], isLoading: loadingLocations } = useLocations();

  if (loadingLocations) {
    return (
      <FormControl w="50%">
        <Skeleton
          height="16px"
          mb={2}
        />
        <Skeleton
          height="40px"
          borderRadius="6px"
        />
      </FormControl>
    );
  }

  const options = locations.map((l) => ({
    value: String(l.id),
    label: l.tagValue,
  }));
  const selectedLocation = locations.find(
    (location) => String(location.id) === String(locationId)
  );

  return (
    <FormControl
      isRequired
      w="50%"
      isDisabled={isLocked}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Location
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
            fontSize="14px"
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {selectedLocation?.tagValue ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <CustomSelect
          options={options}
          value={locationId === "" ? "" : String(locationId)}
          setValue={(val) => setLocationId(Number(val))}
        />
      )}
    </FormControl>
  );
}
