import { useState } from "react";
import {
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Text,
  useControllableState,
  Input,
} from "@chakra-ui/react";
import { getCounter, initializeAccount,  } from "./lib";


function App() {

  const [account, setAccount] = useState(null);
  const [trasacting, setTransacting] = useState(false);

  const connect = async () => {
    if (window.solana && window.solana.isPhantom) {
      const { publicKey } = await window.solana.connect();

      const [_, pubKey] = await initializeAccount(publicKey);
      getCounter(pubKey).then((c) => setCounter(c.counter));
      setAccount(pubKey);
    }
  };



  const [value, setValue] = useControllableState({ defaultValue: "" })
  const handleChange = (event) => setValue(event.target.value)

  return (
<Container centerContent p={5}>
      <Heading>{value}</Heading>
      <Center flexDirection="column" m={5}>
      <Input
            value={value}
            onChange={handleChange}
            width="100%" height={12}
            color='cyan.400'
            placeholder='enter account name'
            _placeholder={{ color: 'inherit' }}
          />
      </Center>
      <HStack gap={10}>
        <Button
          isLoading={trasacting}
          onClick={handleChange}
        >
          Change Account Name
        </Button>
        <Button hidden={account} colorScheme="purple" 
        onClick={connect}
        >
          Create account with Phantom
        </Button>
      </HStack>
      <Center hidden={!account} flexDirection="column" m={5}>
        <Text fontSize="sm" color="gray">
          Address
        </Text>
        <Text fontSize="xl" isTruncated maxW="60ch">
          {account?.toString()}
        </Text>
      </Center>
    </Container>

  );
}
// export const accountData = event.target.value;

export default App;



    