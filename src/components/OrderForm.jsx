/* eslint-disable react/prop-types */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getProducts,
  createSaleOrder,
  getSaleOrderbyId,
} from "../mock_data/api";
import {
  FormControl,
  FormLabel,
  VStack,
  Button,
  Accordion,
  AccordionItem,
  Input,
  Box,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  useColorMode,
  Switch,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";

const OrderForm = ({ orderId }) => {
  const { colorMode } = useColorMode();
  const [selectedItems, setSelectedItems] = useState([]);
  const queryClient = useQueryClient();
  const {
    data: customers,

    error: customerError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const {
    data: products,

    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,

    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer_id: "",
      items: [],
      paid: false,
      invoice_no: "",
      invoice_date: "",
    },
  });

  const invoiceNo = watch("invoice_no");

  useEffect(() => {
    if (invoiceNo && !invoiceNo.startsWith("Invoice - ")) {
      setValue("invoice_no", `Invoice - ${invoiceNo}`);
    }
  }, [invoiceNo, setValue]);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        items: data.items.map((item) => ({
          sku_id: parseInt(item.sku_id),
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity, 10),
        })),
        lastModified: getCurrentDateTime(),
      };

      const newOrder = await createSaleOrder(formattedData);
      queryClient.invalidateQueries(["orders"]);

      console.log(newOrder);

      reset({
        customer_id: "",
        items: [],
        paid: false,
        invoice_no: "",
        invoice_date: "",
      });
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to create sale order:", error);
    }
  };
  const formatDate = (date) => {
    const parts = date.split("/");
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    return formattedDate;
  };

  useEffect(() => {
    try {
      const fetchOrder = async () => {
        if (orderId) {
          const order = await getSaleOrderbyId(orderId);
          console.log("order in fetch", order);

          if (order) {
            reset({
              customer_id: order.customer_id,
              items: order.items.map((item) => ({
                sku_id: item.sku_id,
                price: item.price,
                quantity: item.quantity,
                product_id: products.find((product) =>
                  product.sku.some((sku) => sku.id === item.sku_id)
                )?.id,
              })),
              paid: order.paid,
              invoice_no: order.invoice_no,
              invoice_date: formatDate(order.invoice_date),
            });
            setSelectedItems(
              order.items.map((item) => {
                console.log("item in setslelcted", item);
                const product = products.find((product) =>
                  product.sku.some((sku) => sku.id === item.sku_id)
                );
                console.log("product in fetch fun ", product);
                return {
                  value: product.id,
                  label: product.name,
                };
              })
            );
          }
        }
      };
      fetchOrder();
    } catch (error) {
      console.log(error);
    }
  }, [orderId]);
  useEffect(() => {
    console.log("after model", selectedItems);
  }, [selectedItems]);

  const handleItemChange = (selectedItem) => {
    console.log(selectedItem);
    setSelectedItems(selectedItem);
  };
  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        {customerError && (
          <Alert status="error">
            <AlertIcon />
            Failed to load customers.
          </Alert>
        )}
        {productError && (
          <Alert status="error">
            <AlertIcon />
            Failed to load products.
          </Alert>
        )}
        <FormControl isInvalid={errors.customer_id}>
          <FormLabel>Customer</FormLabel>
          <Controller
            name="customer_id"
            control={control}
            rules={{ required: "Customer is required" }}
            render={({ field }) => (
              <ReactSelect
                {...field}
                options={customers?.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                }))}
                placeholder="Select customer"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    boxShadow: "none",

                    backgroundColor: "none",
                    color: colorMode == "dark" ? "white" : "black",
                    width: "100%",
                  }),
                  option: () => ({
                    backgroundColor: "none",
                    color: "black",
                    borderBottom: "1px solid gray",
                    padding: "5px",
                  }),
                }}
              />
            )}
          />
          <FormErrorMessage>
            {errors.customer_id && errors.customer_id.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={selectedItems.length === 0 && errors.items}>
          <FormLabel>Products</FormLabel>
          <ReactSelect
            options={products?.map((product) => ({
              value: product.id,
              label: product.name,
            }))}
            value={selectedItems}
            onChange={handleItemChange}
            isMulti
            placeholder="Select products"
            styles={{
              control: (provided) => ({
                ...provided,
                boxShadow: "none",

                backgroundColor: "none",
                color: colorMode == "dark" ? "white" : "black",
                width: "100%",
              }),
            }}
          />
          <FormErrorMessage>
            {selectedItems.length === 0 &&
              errors.items &&
              "At least one product is required"}
          </FormErrorMessage>
        </FormControl>

        {selectedItems.length > 0 && (
          <Accordion allowMultiple width={"100%"}>
            {selectedItems.map((product) => {
              const productDetails = products.find(
                (p) => p.id === product.value
              );
              return (
                <AccordionItem key={product.value}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {product.label}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel display={"flex"} gap={5}>
                    {productDetails.sku.map((sku, index) => (
                      <VStack
                        key={sku.id}
                        spacing={4}
                        align="start"
                        bg={colorMode === "dark" ? "#404243" : "#96a3ad"}
                        p={3}
                        rounded={"md"}
                      >
                        <Box>
                          <FormLabel>SKU ID: {sku.id}</FormLabel>
                          <Input
                            type="hidden"
                            {...register(`items.${index}.sku_id`, {
                              required: true,
                            })}
                            defaultValue={sku.id}
                          />
                        </Box>
                        <Box>
                          <FormLabel>Selling Price</FormLabel>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.price`, {
                              required: "Price is required",
                            })}
                            defaultValue={sku.selling_price}
                          />
                          <FormErrorMessage>
                            {errors.items &&
                              errors.items[sku.id]?.price &&
                              errors.items[sku.id].price.message}
                          </FormErrorMessage>
                        </Box>
                        <Box>
                          <FormLabel>Quantity</FormLabel>
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity`, {
                              required: "Quantity is required",
                            })}
                            defaultValue={1}
                          />
                          <FormErrorMessage>
                            {errors.items &&
                              errors.items[sku.id]?.quantity &&
                              errors.items[sku.id].quantity.message}
                          </FormErrorMessage>
                        </Box>
                      </VStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
        <FormControl>
          <FormLabel>Paid</FormLabel>
          <Controller
            name="paid"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                isChecked={field.value}
                colorScheme={colorMode == "dark" ? "whiteAlpha" : "blackAlpha"}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Invoice No</FormLabel>
          <Input type="text" {...register("invoice_no")} />
        </FormControl>
        <FormControl>
          <FormLabel>Invoice Date</FormLabel>
          <Input type="date" {...register("invoice_date")} />
        </FormControl>
        <Button
          color={"white"}
          bg={"teal"}
          type="submit"
          px={10}
          fontSize={"1.5rem"}
          py={6}
        >
          SUBMIT
        </Button>
      </VStack>
    </form>
  );
};

export default OrderForm;
