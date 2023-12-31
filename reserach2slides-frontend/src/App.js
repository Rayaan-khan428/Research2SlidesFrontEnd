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
      // Notify user that the request is being sent
      toast({
        title: "Sending Request",
        description: "Your conversion request is being sent. Please wait...",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      const response = await axios.post("https://research2slides-4d84a4b3a938.herokuapp.com/api/convert", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'  // <-- Add this line
      });
  
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'converted_presentation.pptx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Conversion Successful",
          description: "Your file has been converted and is ready for download.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

      } else {
        toast({
          title: "Conversion Failed",
          description: "There was an issue converting your file. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error during conversion:", error);
    }
  };

  return (
    <ChakraProvider>
        <CSSReset />
        <Flex direction="column" align="center" m={[2, 4, 6, 8]}> {/* <-- Responsive margin */}
            <Flex align="center" my={[3, 4, 5, 6]} direction={["column", "row", "row", "row"]}> {/* <-- Responsive Flex direction and margin */}
                <Image src="./logo.png" alt="Research2Slides Logo" boxSize={["50px", "60px", "70px", "80px"]} mb={["2", "0", "0", "0"]} /> {/* <-- Responsive image size and margin-bottom */}
                <Heading fontSize={["xl", "2xl", "3xl", "4xl"]} ml={[0, 3, 4, 5]}> {/* <-- Responsive font size and margin-left */}
                    Research2Slides
                </Heading>
            </Flex>
            <DesignSelector design={design} setDesign={setDesign} setUploadedFile={setUploadedFile} />
            <ConvertButton onConvert={handleConversion} />
        </Flex>
    </ChakraProvider>
);
}

export default App;