// const customerss = [
//   {
//     id: 11908,
//     name: "Ram",
//     color: [182, 73, 99],
//     email: "jesus_christ@church.com",
//     pincode: "Mumbai",
//     location_name: "Mumbai, Maharashtra, India",
//     type: "C",
//     profile_pic: null,
//     gst: "",
//   },
//   {
//     id: 11909,
//     name: "Shyam",
//     color: [120, 180, 200],
//     email: "shyam_kumar@company.com",
//     pincode: "Pune",
//     location_name: "Pune, Maharashtra, India",
//     type: "B",
//     profile_pic: null,
//     gst: "27AAAAA0000A1Z5",
//   },
//   {
//     id: 11910,
//     name: "Shyam rav bhujadi",
//     color: [120, 180, 200],
//     email: "shyam_kumar@company.com",
//     pincode: "Pune",
//     location_name: "Pune, Maharashtra, India",
//     type: "B",
//     profile_pic: null,
//     gst: "27AAAAA0000A1Z5",
//   },
// ];

// const productss = [
//   {
//     id: 209,
//     name: "New Product",
//     category: "The god of War",
//     characteristics: "New Product Characteristics",
//     brand: "New Product Brand",
//     sku: [
//       {
//         id: 248,
//         selling_price: 54,
//         max_retail_price: 44,
//         amount: 33,
//         unit: "kg",
//         quantity_in_inventory: 0,
//       },
//       {
//         id: 247,
//         selling_price: 32,
//         max_retail_price: 32,
//         amount: 33,
//         unit: "kg",
//         quantity_in_inventory: 0,
//       },
//       {
//         id: 246,
//         selling_price: 23,
//         max_retail_price: 21,
//         amount: 22,
//         unit: "kg",
//         quantity_in_inventory: 1,
//       },
//     ],
//   },
//   {
//     id: 210,
//     name: "Another Product",
//     category: "Electronics",
//     characteristics: "Another Product Characteristics",
//     brand: "Another Product Brand",
//     sku: [
//       {
//         id: 249,
//         selling_price: 100,
//         max_retail_price: 90,
//         amount: 50,
//         unit: "pcs",
//         quantity_in_inventory: 10,
//       },
//     ],
//   },
// ];

// const saleOrderss = [
//   {
//     id: 1,
//     customer_id: 11908,
//     items: [
//       {
//         sku_id: 248,
//         price: 100,
//         quantity: 1,
//       },
//     ],
//     paid: false,
//     invoice_no: "Invoice - 1212121",
//     invoice_date: "7/5/2024",
//     lastModified: "24/5/2024 (11:07 PM)",
//   },
//   {
//     id: 2,
//     customer_id: 11909,
//     items: [
//       {
//         sku_id: 249,
//         price: 150,
//         quantity: 2,
//       },
//     ],
//     paid: true,
//     invoice_no: "Invoice - 1212122",
//     invoice_date: "8/5/2024",
//     lastModified: "25/5/2024 (10:00 AM)",
//   },
// ];
// localStorage.setItem("saleOrders", JSON.stringify(saleOrderss));
// localStorage.setItem("customers", JSON.stringify(customerss));
// localStorage.setItem("products", JSON.stringify(productss));

const customers = JSON.parse(localStorage.getItem("customers")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];
const saleOrders = JSON.parse(localStorage.getItem("saleOrders")) || [];

const formatDate = (IsoDate) => {
  console.log("iso date is", IsoDate);
  const parts = IsoDate.split("-");
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const getCustomers = async () => customers;
export const getProducts = async () => products;
export const getSaleOrders = async () => saleOrders;
export const createSaleOrder = async (newOrder) => {
  const obj = {
    ...newOrder,
    id: saleOrders.length + 1,
    customer_id: newOrder.customer_id.value,
    invoice_date: formatDate(newOrder.invoice_date),
  };
  saleOrders.push(obj);
  localStorage.setItem("saleOrders", JSON.stringify(saleOrders));
  return newOrder;
};
export const getSaleOrderbyId = async (id) => {
  return saleOrders.find((saleOrder) => saleOrder.id == id);
};
