import { useEffect, useRef, useState } from "react";



import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Skeleton, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr, Wrap, WrapItem } from "@chakra-ui/react";



import TextPopup from "@/components/common/TextPopup";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";
import { MdPersonAdd } from "react-icons/md";





const SELECTED_BG = "#EDF2F7";

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
  onProviderDoubleClick,
  loading,
  onCreateProvider,
}) {
  const { data: tagsData } = useTags();
  const tagsMap = tagsData?.tagsMap ?? {};
  const [selectedRowId, setSelectedRowId] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedCategories = [...providerCategories].sort(
    (a, b) => a.columnOrder - b.columnOrder
  );

  const fixedThProps = {
    fontFamily: "Inter",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "16px",
    letterSpacing: "0.6px",
    padding: "15px 25px 15px 25px",
    backgroundColor: "#C8D4E6",
    color: "#113D64",
    borderRight: "1px solid",
    borderColor: "gray.200",
  };

  const defaultHeaderCells = (
    <>
      <Th {...fixedThProps}>Provider</Th>
      <Th {...fixedThProps}>NPI/License</Th>
    </>
  );

  const Header = () => {
    const dynamicColumns = sortedCategories.map((cat) => (
      <Th
        key={cat.name}
        {...fixedThProps}
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
        <Tr>
          {defaultHeaderCells}
          {dynamicColumns}
          <Th {...fixedThProps} borderRight="none">Long Term Notes</Th>
        </Tr>
      </Thead>
    );
  };

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
      return null;
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
    const isSelected = selectedRowId === provider.id;

    const fixedTdProps = {
      borderRight: "1px solid",
      borderColor: "gray.200",
    };

    const dynamicCells = providerCategories.map((cat) => (
      <Td
        key={cat.name}
        {...fixedTdProps}
      >
        {renderCellValue(provider, cat)}
      </Td>
    ));

    return (
      <Tr
        borderBottom="1px solid"
        borderColor="gray.200"
        cursor={onProviderDoubleClick ? "pointer" : "default"}
        sx={
          isSelected ? { background: `${SELECTED_BG} !important` } : undefined
        }
        _hover={
          onProviderDoubleClick
            ? { bg: isSelected ? SELECTED_BG : "gray.50" }
            : {}
        }
        onClick={() => {
          if (!onProviderDoubleClick) return;
          if (selectedRowId === provider.id) {
            onProviderDoubleClick(provider);
          } else {
            setSelectedRowId(provider.id);
          }
        }}
      >
        <Td {...fixedTdProps}>
          <Text
            fontFamily="Inter"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="22px"
            color="#113D64"
          >
            {provider.name ?? ""}
            {provider.degree ? `, ${provider.degree}` : ""}
          </Text>
          {provider.phoneNumber && (
            <Text
              fontFamily="Inter"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="18px"
              color="gray.500"
            >
              {provider.phoneNumber}
            </Text>
          )}
          {provider.dea && (
            <Text
              fontFamily="Inter"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="18px"
              color="gray.500"
            >
              DEA: {provider.dea}
            </Text>
          )}
        </Td>
        <Td {...fixedTdProps}>
          <Text
            fontFamily="Inter"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="22px"
            color="#113D64"
          >
            {provider.license ?? ""}
          </Text>
        </Td>
        {dynamicCells}
        <Td {...fixedTdProps}>
          {provider.notes && provider.notes.length > 100 ? (
            <TextPopup
              text={provider.notes}
              truncateAt={100}
            />
          ) : (
            <Text
              fontFamily="Inter"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="22px"
              color="#113D64"
            >
              {provider.notes ?? ""}
            </Text>
          )}
        </Td>
      </Tr>
    );
  };

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
      ref={tableRef}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflowY="auto"
    >
      <Table
        sx={{
          "tbody tr:nth-of-type(even)": { bg: "#F9F9F9" },
          "tbody tr:nth-of-type(odd)": { bg: "white" },
        }}
      >
        {loading ? (
          <>
            <SkeletonHeader />
            <SkeletonBody />
          </>
        ) : providers.length === 0 ? (
          <>
            <Thead bg="#EBEBEB" h="40px" position="sticky" top={0} zIndex={1}>
              <Tr>
                {defaultHeaderCells}
                <Th {...fixedThProps} borderRight="none">Long Term Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td colSpan={1000} height={"424px"} textAlign="center" py={10}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <MdPersonAdd size={69} color="#586771" />
                    <Text fontFamily="Lato" fontSize="22px" color="rgba(88, 103, 113, 0.73)">
                      No providers added yet.
                    </Text>
                    <Text fontFamily="Lato" fontSize="16px" color="rgba(88, 103, 113, 0.73)">
                      Add a provider to view and manage their information.
                    </Text>
                    <Button
                      marginTop={"29px"}
                      bg="#35639D"
                      color="white"
                      h={"40px"}
                      w={"211px"}
                      padding={"0 16px"}
                      iconSpacing={"8px"}
                      fontFamily={"Inter"}
                      fontSize={"16px"}
                      fontStyle={"normal"}
                      fontWeight={"light"}
                      lineHeight={"28px"}
                      _hover={{ bg: "#35639D" }}
                      leftIcon={<AddIcon boxSize={"12px"}/>}
                      borderRadius={"6px"}
                      onClick={onCreateProvider}
                    >
                      Create Provider
                    </Button>
                  </Box>
                </Td>
              </Tr>
            </Tbody>
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
