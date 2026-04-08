import {
  Skeleton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import TextPopup from "@/components/common/TextPopup";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";

const SkeletonHeader = () => {
  return (
    <Thead>
      <Tr>
        {Array.from({ length: 4 }, (_, i) => (
          <Th
            key={i}
            p={0}
          >
            <Skeleton height="60px" />
          </Th>
        ))}
      </Tr>
    </Thead>
  );
};

const SkeletonBody = () => {
  return (
    <Tbody>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr
          key={i}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Td>
            <Skeleton height="40px" />
          </Td>
          <Td>
            <Skeleton height="40px" />
          </Td>
          <Td>
            <Skeleton height="40px" />
          </Td>
          <Td>
            <Skeleton height="40px" />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export default function ProviderTable({
  providers,
  providerCategories,
  selectedProviderId,
  onProviderSelect,
  onProviderDoubleClick,
  loading,
}) {
  const { data: tagsData } = useTags();
  const tagsMap = tagsData?.tagsMap ?? {};

  // sort categories by columnOrder
  const sortedCategories = [...providerCategories].sort(
    (a, b) => a.columnOrder - b.columnOrder
  );
  /**
   * Making table header by mapping categories from providerCategories
   * @returns <Thead> with each category as a cell in the header row.
   */
  const Header = () => {
    const columns = sortedCategories.map((cat) => (
      <Th
        key={cat.name}
        fontFamily="Inter"
        fontSize="12px"
        fontStyle="normal"
        fontWeight="700"
        lineHeight="16px"
        letterSpacing={"0.6px"}
        padding={"15px 25px 15px 25px"}
        backgroundColor="#C8D4E6"
        color="#113D64"
      >
        {cat.name}
      </Th>
    ));

    return (
      <Thead
        bg="#EBEBEB"
        h="40px"
        position="sticky"
        top={0}
        zIndex={1}
      >
        <Tr>{columns}</Tr>
      </Thead>
    );
  };

  /**
   * Based on each category, takes data from each provider to render
   * the correct information in the respective cells.
   *
   * Will be used by Body subcomponent.
   * @returns <Tr> with each cell of necessary provider info <Td>.
   */
  const renderCellValue = (provider, cat) => {
    const raw = provider?.data?.[cat.name];

    // Treat undefined/null/"" as missing
    const isMissing =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && raw.trim() === "") ||
      (Array.isArray(raw) && raw.length === 0);

    if (isMissing) {
      // Defaults per inputType
      if (cat.inputType === "tag")
        return <Text 
        color="gray.400" 
        fontFamily={"Inter"} 
        fontSize={"14px"} 
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"22px"}>
          NO TAGS SELECTED
        </Text>;
      return <Text 
        color="gray.400"
        fontFamily={"Inter"} 
        fontSize={"14px"} 
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"22px"}>
      </Text>;
    }

    // Format per inputType
    if (cat.inputType === "tag") {
      // Support either array or comma-separated string
      const tags = Array.isArray(raw)
        ? raw.filter((t) => t !== null && t !== "")
        : String(raw)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

      return (
        <Wrap>
          {tags.map((t) => (
            <WrapItem key={t}>
              <Tag
                display="flex"
                padding="2px 6px"
                alignItems="center"
                gap="6px"
                borderRadius="6px"
                backgroundColor="#35639D"
                fontFamily="Lato"
                fontSize="14px"
                fontStyle="normal"
                fontWeight="500"
                lineHeight="normal"
                color="#FFF"
              >
                {tagsMap[t]?.tagValue || t}
              </Tag>
              {/* TODO: @xgraceyan Remove safeguard when we transition all the tags to IDs. */}
            </WrapItem>
          ))}
        </Wrap>
      );
    }
    if (cat.inputType === "text") {
      const text = String(raw);

      if (text.length > 200) {
        return (
          <TextPopup
            text={text}
            truncateAt={200}
          />
        );
      }

      return (
        <Text
          fontFamily="Inter"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
          lineHeight="22px"
          color="#113D64"
        >
          {text}
        </Text>
      );
    }

    // Default rendering
    return String(raw);
  };

  const ProviderRow = ({ provider }) => {
    const isSelected = selectedProviderId === provider.id;

    const getCells = () =>
      providerCategories.map((cat) => (
        <Td
          key={cat.name}
          borderRight="1px solid"
          borderColor="gray.200"
        >
          {renderCellValue(provider, cat)}
        </Td>
      ));

    return (
      <Tr
        borderBottom="1px solid"
        borderColor="gray.200"
        cursor={onProviderSelect ? "pointer" : "default"}
        bg={isSelected ? "blue.50" : "transparent"}
        _hover={
          onProviderSelect ? { bg: isSelected ? "blue.100" : "gray.50" } : {}
        }
        onClick={() => onProviderSelect?.(provider)}
        onDoubleClick={() => onProviderDoubleClick?.(provider)}
      >
        {getCells()}
      </Tr>
    );
  };

  /**
   * Uses ProviderRow subcomp to display provider data.
   * @returns <Tbody> containing all rows of provider info.
   */
  const Body = () => {
    const rows = providers.map((prov) => (
      <ProviderRow
        key={prov.id}
        provider={prov}
      />
    ));
    return <Tbody>{rows}</Tbody>;
  };

  return (
    <TableContainer
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      maxHeight="60vh"
      overflowY="auto"
    >
      <Table
        sx={{
          "tbody tr:nth-of-type(even)": {
            bg: "#F9F9F9", // Your custom stripe color
          },
          "tbody tr:nth-of-type(odd)": {
            bg: "white", // Ensures the other rows are solid white
          },
        }}
      >
        {/**Subcomps to simplify structure */}
        {loading ? (
          <>
            <SkeletonHeader />
            <SkeletonBody />
          </>
        ) : (
          <>
            <Header />
            <Body />
          </>
        )}
      </Table>
    </TableContainer>
  );
}
