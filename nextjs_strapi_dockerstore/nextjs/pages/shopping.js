import React from "react";
import Cart from "../components/Cart/Cart";

const Shopping = () => {
  return (
    <div> 
      <Cart />
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      protected: true
    }
  }
}

export default Shopping;