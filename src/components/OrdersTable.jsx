/* eslint-disable react/prop-types */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import OrderForm from "./OrderForm";

const OrdersTable = ({ orders }) => {
  const { colorMode } = useColorMode();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openModal = (order) => {
    setSelectedOrderId(order.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setIsOpen(false);
  };

  const handleEditClick = (order) => {
    console.log("order inside model", order);
    openModal(order);
  };
  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Customer Name</Th>
            <Th>Price</Th>
            <Th>Last Modified</Th>
            <Th>Edit/View</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customer_id}</Td>
              <Td>
                {order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </Td>
              <Td>{order.lastModified}</Td>
              <Td>
                <Button onClick={() => handleEditClick(order)}>
                  Edit/View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="xl"
        colorScheme={colorMode == "dark" ? "white" : "black"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Order / view</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderForm orderId={selectedOrderId} onClose={closeModal} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrdersTable;
