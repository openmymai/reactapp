import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Cookie from "js-cookie";
import AppContext from "../../context/AppContext";
import axios from "axios";

function CheckoutForm(props) {
  const appContext = useContext(AppContext);
  const router = useRouter();

  function submitOrder() {
    // Add order to database
    const userToken = Cookie.get("token");
    (async() => {
      const orderdata = {
        amount: Number(Math.round(appContext.cart.total + "e2") + "e-2"),
        products: appContext.cart.items,
        customer: props.selectedCustomer,
        ordertype: props.selectedOrder
      };
      const headers = {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${userToken}`
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, orderdata, { headers })
        .then(response => response.data)
        .catch(error => {
          console.error("There was an error!", error);
        });
    })();
 
    // Update stock realtime
    appContext.cart.items.map(async (res) => {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${userToken}`
      };
      const stock = {
        unitinstock: res.unitinstock - res.quantity,
        frequency: res.frequency + res.quantity
      };
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${res.id}`, stock, { headers })
        .then(response => response.data)
        .catch(error => {
          console.error("There was an error!", error);
        })
    });    

    appContext.cart.total = 0;
    appContext.cart.items = [];
    Cookie.remove("cart");
    
    router.replace(router.asPath);
    window.location.reload(false);
    
  }

  return (
    <div>
        <Button
          variant="primary"
          style={{ width: "100%" }}
          onClick={() => submitOrder()}
        >จ่ายเงิน</Button>
    </div>
  );
}
export default CheckoutForm;