import { Flex, Heading, useToast, Image } from "@chakra-ui/react";
import { useState } from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import DesignSelector from "./components/design";
import ConvertButton from "./components/convert";
import axios from 'axios';

function App() {
  
  const [design, setDesign] = useState(null);
  const toast = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);


  const handleConversion = async () => {
    const formData = new FormData();
    formData.append("design", design);
    formData.append("pdfFile", uploadedFile); // Assuming you have the uploaded file stored in a state
  
    try {
      const response = await axios.post("http://localhost:8080/api/convert", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        const data = response.data;
        // Handle the received PowerPoint data (e.g., download it)
      } else {
        // Handle the error
      }
    } catch (error) {
      console.error("Error during conversion:", error);
    }
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Flex direction="column" align="center" m={4}>
        <Flex align="center" my={5}>
          <Image src="./logo.png" alt="Research2Slides Logo" boxSize="70px" mr={3} />
          <Heading>Research2Slides</Heading>
        </Flex>
        <DesignSelector design={design} setDesign={setDesign} setUploadedFile={setUploadedFile} />
        <ConvertButton onConvert={handleConversion} />
      </Flex>
    </ChakraProvider>
  );
}

export default App;