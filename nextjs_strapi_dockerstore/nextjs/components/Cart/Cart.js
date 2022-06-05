import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Form, Button, Card, Badge, Row, Col } from "react-bootstrap";
import Cookie from "js-cookie";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import NumberFormat from 'react-number-format';
import CheckoutForm from "../Checkout/CheckoutForm";
import AppContext from "../../context/AppContext";
import ProductList from "../ProductList";

function Cart() {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const { cart, isAuthenticated } = appContext;
  const [ selectCustomer, setSelectCustomer ] = useState(null);
  const [ selectOrder, setSelectOrder ] = useState(null);
  const [ customers, setCustomers ] = useState([]);

  useEffect(() => {
    const userToken = Cookie.get("token")
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, { headers })
    .then(response => setCustomers(response.data))
    .catch(error => {
      console.error("There was an error!", error)
    });
  },[]);

  const ordertype = [
    { value: "สด", label: "สด" }, 
    { value: "เชื่อ", label: "เชื่อ" },
    { value: "โอน", label: "โอน" } 
  ];
  console.log(customers)
  const customersList = customers.length > 0
    && customers.map((item) => {
      return (
        { value: `${item.customer}`, label: `${item.customer}`}
      )
    })
  
  return (
    <div>      
      <Form>
        <Row>
          <Col>
            <Form.Label>ชื่อลูกค้า</Form.Label>
              <CreatableSelect
                isClearable
                instanceId="customer"
                options={customersList} 
                value={selectCustomer}
                onChange={(selectedValue) => {
                  setSelectCustomer(selectedValue)
                }}
              />
            <br />
          </Col>
          <Col>
            <Form.Label>รายการซื้อ</Form.Label>
              <CreatableSelect
                isClearable
                instanceId="order"
                options={ordertype} 
                value={selectOrder}
                onChange={(selectedValue) => {
                  setSelectOrder(selectedValue)
                }}
              />
          </Col>
        </Row>
      </Form>
      <br />
      <Card style={{ padding: "10px 5px" }} className="cart">
        <Card.Title style={{ margin: 10 }}>รายการสินค้า</Card.Title>
        <hr />
        <Card.Body style={{ padding: 10 }}> 
            สินค้า
          <div>
            {cart.items ?
               cart.items.map((item) => {
                  if (item.quantity > 0) {
                    return (
                      <div
                        className="items-one"
                        style={{ marginBottom: 15 }}
                        key={item.id}
                      >
                        <div>
                          <span id="item-price">&nbsp; ฿{item.unitprice}</span>
                          <span id="item-name">&nbsp; {item.productname}</span>
                        </div>
                        <div>
                          <Button
                            style={{
                              height: 25,
                              padding: 0,
                              width: 15,
                              marginRight: 5,
                              marginLeft: 10,
                            }}
                            onClick={() => appContext.addItem(item)}
                            color="link"
                          >
                            +
                          </Button>
                          <Button
                            style={{
                              height: 25,
                              padding: 0,
                              width: 15,
                              marginRight: 10,
                            }}
                            onClick={() => appContext.removeItem(item)}
                            color="link"
                          >
                            -
                          </Button>
                          <span style={{ marginLeft: 5 }} id="item-quantity">
                            จำนวน {item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })
              : null}


            {isAuthenticated ? (
              cart.items.length > 0 ? (
                <div>
                  <Badge bg="light" text="dark">
                    <h3>รวม</h3>
                      <h1>
                        <NumberFormat
                          value={appContext.cart.total.toFixed(2)}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'฿'}
                          renderText={(value, props) => <div {...props}>{value} บาท</div>}
                        />
                      </h1>
                  </Badge>
                  {router.pathname === "/" && (
                    <div
                      style={{
                        marginTop: 10,
                        marginRight: 10,
                      }}
                    >

                    </div>
                  )}
                </div>
              ) : (
                <>
                  {router.pathname === "/checkout" && (
                    <small
                      style={{ color: "blue" }}
                      onClick={() => window.history.back()}
                    >
                      back to Productlist
                    </small>
                  )}
                </>
              )
            ) : (
              <h5>Login to Order</h5>
            )}
          </div>
        </Card.Body>
      </Card>
      <br />

      {!!selectCustomer && !!selectOrder ? (
        <div>
          <CheckoutForm 
            selectedCustomer={selectCustomer.value} 
            selectedOrder={selectOrder.value} 
          />
          <br />
          <ProductList />
        </div>
      ) : (
        <div></div>
      )}
    </div>
    
  );
}
export default Cart;