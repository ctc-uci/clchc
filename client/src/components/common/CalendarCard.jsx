import { useEffect, useState } from "react";

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarCard = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = value ? new Date(value + "T00:00:00") : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    const d = value ? new Date(value + "T00:00:00") : new Date();
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [value]);

  const handleOpen = () => {
    const d = value ? new Date(value + "T00:00:00") : new Date();
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    setIsOpen(true);
  };

  const handleDayClick = (day) => {
    const y = viewMonth.getFullYear();
    const m = String(viewMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = viewMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA");
  const displayValue = value === todayStr
    ? "Today"
    : value
      ? new Date(value + "T00:00:00").toLocaleDateString("en-US")
      : "Select date";

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-end"
      closeOnBlur
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          rightIcon={<ChevronDownIcon />}
          onClick={handleOpen}
          h="45px"
          w="110px"
          px={3}
          justifyContent="center"
          fontFamily="Lato"
          fontWeight="500"
          fontSize="14px"
          fontStyle="normal"
          lineHeight="28px"
          color="#000"
          bg="var(--white, #FFF)"
          borderRadius="4px"
          border="0.84px solid #E3E3E3"
          _hover={{ bg: "white", borderColor: "#CBD5E0" }}
          _active={{ bg: "white" }}
        >
          {displayValue}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        w="280px"
        boxShadow="lg"
        borderRadius="xl"
        borderColor="gray.200"
        p={0}
      >
        <PopoverBody p={4}>
          <Flex
            justify="space-between"
            align="center"
            mb={3}
          >
            <Flex align="center" gap={1}>
              <Text fontWeight="semibold" fontSize="sm">
                {monthLabel}
              </Text>
              <ChevronRightIcon color="gray.500" boxSize={3} />
            </Flex>
            <Flex gap={1}>
              <IconButton
                icon={<ChevronLeftIcon />}
                size="sm"
                variant="ghost"
                onClick={prevMonth}
                aria-label="Previous month"
                borderRadius="md"
              />
              <IconButton
                icon={<ChevronRightIcon />}
                size="sm"
                variant="ghost"
                onClick={nextMonth}
                aria-label="Next month"
                borderRadius="md"
              />
            </Flex>
          </Flex>

          <Grid
            templateColumns="repeat(7, 1fr)"
            mb={1}
          >
            {DAYS_OF_WEEK.map((d) => (
              <Text
                key={d}
                textAlign="center"
                fontSize="xs"
                color="gray.500"
                fontWeight="medium"
                pb={1}
              >
                {d}
              </Text>
            ))}
          </Grid>

          <Grid templateColumns="repeat(7, 1fr)">
            {Array.from({ length: firstDay }).map((_, i) => (
              <Box key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selectedDate = value ? new Date(value + "T00:00:00") : null;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === day;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <Button
                  key={day}
                  size="xs"
                  variant="ghost"
                  borderRadius="full"
                  onClick={() => handleDayClick(day)}
                  h="32px"
                  w="32px"
                  minW="32px"
                  p={0}
                  bg={isSelected ? "pink.100" : undefined}
                  color={isSelected ? "pink.600" : isToday ? "gray.800" : undefined}
                  fontWeight={isToday || isSelected ? "bold" : "normal"}
                  border={isToday && !isSelected ? "1.5px solid" : undefined}
                  borderColor={isToday && !isSelected ? "gray.400" : undefined}
                  _hover={{ bg: isSelected ? "pink.200" : "gray.100" }}
                >
                  {day}
                </Button>
              );
            })}
          </Grid>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarCard;
