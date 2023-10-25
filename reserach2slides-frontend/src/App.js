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
    formData.append("pdfFile", uploadedFile);
  
    try {
      // Notify user that the request is being sent
      toast({
        title: "Sending Request",
        description: "Your conversion request is being sent. Please wait...",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
  
      const response = await axios.post("https://research2slides-4d84a4b3a938.herokuapp.com/api/convert", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        const jobId = response.data.jobId; // Assuming the backend returns a jobId
        checkConversionStatus(jobId); // Start polling for status
      } else {
        showErrorToast();
      }
    } catch (error) {
      console.error("Error during conversion:", error);
      showErrorToast();
    }
  };
  
  const checkConversionStatus = async (jobId) => {
    try {
      const response = await axios.get(`https://research2slides-4d84a4b3a938.herokuapp.com/api/convert/status/${jobId}`);
  
      if (response.status === 200) {
        if (response.data.status === "completed") {
          // Handle successful conversion and download
          const blob = new Blob([response.data.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
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
          });
        } else if (response.data.status === "processing") {
          // If still processing, wait and check again
          setTimeout(() => checkConversionStatus(jobId), 5000);
        } else {
          showErrorToast();
        }
      } else {
        showErrorToast();
      }
    } catch (error) {
      console.error("Error checking conversion status:", error);
      showErrorToast();
    }
  };
  
  const showErrorToast = () => {
    toast({
      title: "Conversion Failed",
      description: "There was an issue converting your file. Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
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