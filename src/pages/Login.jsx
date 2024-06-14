import { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  const { login } = useAuth();
  const handleLogin = (e) => {
    e.preventDefault();
    login(userName, password);
  };
  return (
    <VStack width={"100%"} height={"100vh"} justifyContent={"center"}>
      <div>
        <IconButton
          icon={colorMode == "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div>

      <Container
        maxW="container.lg"
        color={colorMode == "dark" ? "white" : "black"}
        border={colorMode == "dark" ? "2px solid white" : "2px solid black"}
        width={"50%"}
        p={10}
        rounded={"xl"}
      >
        <FormControl>
          <FormLabel>USERNAME</FormLabel>
          <Input type="text" onChange={(e) => setUserName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>PASSWORD</FormLabel>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit" onClick={handleLogin}>
          LOGIN
        </Button>
      </Container>
      <p>username : username , password: password</p>
    </VStack>
  );
};

export default Login;
