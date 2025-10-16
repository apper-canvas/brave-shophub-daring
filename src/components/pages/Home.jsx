import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";

const Home = () => {
  const { onAddToCart } = useOutletContext();

  return (
    <div>
      <ProductGrid onAddToCart={onAddToCart} />
    </div>
  );
};

export default Home;