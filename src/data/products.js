import headphones from "../assets/products/headphones.jpg";
import smartwatch from "../assets/products/smartwatch.jpg";
import sneakers from "../assets/products/sneakers.jpg";
import chair from "../assets/products/chair.jpg";

const products = [
  {
  id: 1,
  name: "Wireless Headphones",
  category: "Electronics",
  price: 99,
  oldPrice: 129,
  rating: 4.8,
  stock: 25,
  image: headphones,
  description:
    "High-quality wireless headphones with noise cancellation and long battery life.",
},
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 149,
    oldPrice: 199,
    image: smartwatch,
    rating: 4.7,
    stock: 15,
    description:
    "High-quality wireless headphones with noise cancellation and long battery life.",
  },
  {
    id: 3,
    name: "Running Sneakers",
    category: "Sports",
    price: 89,
    oldPrice: 120,
    image: sneakers,
    rating: 4.9,
    stock: 10,
    description:
    "High-quality wireless headphones with noise cancellation and long battery life.",
  },
  {
    id: 4,
    name: "Office Chair",
    category: "Furniture",
    price: 179,
    oldPrice: 220,
    image: chair,
    rating: 4.6,
    stock: 8,
    description:
    "High-quality wireless headphones with noise cancellation and long battery life.",
  },
];

export default products;