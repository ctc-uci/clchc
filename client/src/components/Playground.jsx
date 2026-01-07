import React, {useState} from "react";
import { Box, Text } from "@chakra-ui/react";
import ProgressBar from "./ProgressBar.jsx";


export const Playground = () => {
  const [ currentProgress, setCurrentProgress ] = useState(5);

  return (
    <Box>
      <Text>Place your items here for testing</Text>
      <ProgressBar currentProgress={currentProgress} setCurrentProgress={setCurrentProgress}/>
    </Box>
  );
};

