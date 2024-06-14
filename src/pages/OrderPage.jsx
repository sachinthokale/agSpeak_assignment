import {
  Box,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from "@chakra-ui/react";
import OrdersTable from "../components/OrdersTable";
import { getSaleOrders } from "../mock_data/api";
import { useQuery } from "@tanstack/react-query";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import OrderForm from "../components/OrderForm";

const OrderPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    data: orders,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getSaleOrders,
  });
  if (isFetching) console.log("fetching.....");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  const activeOrders = orders ? orders.filter((order) => !order.paid) : [];
  const completedOrders = orders ? orders.filter((order) => order.paid) : [];

  return (
    <HStack
      display={"flex"}
      justifyContent={"center"}
      width={"100vw"}
      height={"100vh"}
      flexDirection={"column"}
    >
      <div>
        <IconButton
          icon={colorMode == "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div>

      <Box
        p={5}
        border={colorMode == "dark" ? "2px solid white" : "2px solid black"}
        borderRadius={"2xl"}
        width={[
          "100%", // 0-30em
          "90%", // 30em-48em
          "80%", // 48em-62em
          "70%", // 62em+
        ]}
        height={["50%", "80%"]}
        overflow={"hidden"}
      >
        <Tabs
          variant="soft-rounded"
          height="100%"
          colorScheme={colorMode == "dark" ? "whiteAlpha" : "blackAlpha"}
        >
          <TabList>
            <Tab
              fontSize={["0.8rem", "1.5rem"]}
              px={[5, 10]}
              py={[1, 4]}
              color={colorMode == "dark" ? "white" : "black"}
            >
              Active Sale Orders
            </Tab>
            <Tab
              fontSize={["0.8rem", "1.5rem"]}
              px={[5, 10]}
              py={[1, 4]}
              color={colorMode == "dark" ? "white" : "black"}
            >
              Completed Sale Orders
            </Tab>
            <Tab
              fontSize={["0.8rem", "1.5rem"]}
              px={[5, 10]}
              py={[1, 4]}
              bg={"teal"}
              color="white"
            >
              +Sale Order
            </Tab>
          </TabList>

          <TabPanels height="calc(100% - 3rem)" overflowY="auto">
            <TabPanel height="100%" overflowY="auto">
              <OrdersTable orders={activeOrders} />
            </TabPanel>
            <TabPanel height="100%" overflowY="auto">
              <OrdersTable orders={completedOrders} />
            </TabPanel>
            <TabPanel height="100%" overflowY="auto">
              <OrderForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </HStack>
  );
};

export default OrderPage;
