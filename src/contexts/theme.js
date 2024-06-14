// theme.js
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg:
          props.colorMode === "dark"
            ? "linear-gradient(to right, #232526, #414345)"
            : "linear-gradient(to right, #8e9eab, #eef2f3)",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
});

export default customTheme;
