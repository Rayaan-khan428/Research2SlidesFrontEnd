import { Box, Grid, Flex, Image, useRadio, UseRadioProps, Text, Button, Tooltip, Icon, Spinner } from "@chakra-ui/react";
import { ArrowUpIcon } from '@chakra-ui/icons'; 
import { useRef } from "react";

// Custom radio button to represent each design
function DesignRadio(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);
  
    const input = getInputProps();
    const checkbox = getCheckboxProps();
  
    return (
      <Box as="label">
        <input {...input} />
        <Flex
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          width="240px"
          height="160px"
          alignItems="center"
          justifyContent="center"
          _hover={{          
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)', 
            transform: 'scale(1.05)',
          }}
          _checked={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
          }}
        >
          <Image src={props.imgSrc} alt={props.children} width="90%" height="90%" objectFit="cover" />
        </Flex>
        <Text mt={2} textAlign="center">{props.description}</Text>
      </Box>
    );
}


function DesignSelector({ design, setDesign, setUploadedFile }) {
  const designs = [
    { name: 'design1', src: '/design-covers/design1.png', description: 'Colorful' },
    { name: 'design2', src: '/design-covers/design2.png', description: 'Minimal' },
    { name: 'design3', src: '/design-covers/design3.png', description: 'Galaxy' },
    { name: 'design4', src: '/design-covers/design4.png', description: 'Geometric' },
    { name: 'design5', src: '/design-covers/design5.png', description: 'Pink' },
    { name: 'design6', src: '/design-covers/design6.png', description: 'Minimal' },
    { name: 'design7', src: '/design-covers/design7.png', description: 'Nature' },
    { name: 'design8', src: '/design-covers/design8.png', description: 'Abstract' },  ];

    const fileInputRef = useRef(null); // <-- reference to the file input

    const handleUpload = () => {
      // Trigger the click event of the file input element
      fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file:", file.name);
        setUploadedFile(file); // Set the uploaded file to the state
      }
    };

    return (
      <Flex flexDirection="column">
        {/* Invisible file input element */}
        <input 
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Flex justifyContent="flex-end" mb={4}>
          <Button 
            leftIcon={<ArrowUpIcon />} 
            size="lg"                   
            colorScheme="green" 
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Flex>
        <Text fontSize={["2xl", "3xl", "4xl"]} mb={4} textAlign="center">  {/* <-- Responsive font size */}
          Select Design:
        </Text>
        <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={6}>  {/* <-- Responsive columns */}
          {designs.map((designData) => (
            <DesignRadio
              key={designData.name}
              value={designData.name}
              isChecked={design === designData.name}
              onChange={(e) => setDesign(e.target.value)}
              imgSrc={designData.src}
              description={designData.description}
            >
              {designData.name}
            </DesignRadio>
          ))}
        </Grid>
      </Flex>
    );
}

export default DesignSelector;