import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import useSWR from "swr";
import axios from "axios";
import Cookie from "js-cookie";
import CreatableSelect from "react-select/creatable";
import NumberFormat from 'react-number-format';

const userToken = Cookie.get("token")
const fetcher = (url, token) => axios.get(url, { headers: { Authorization: "Bearer " + token }}).then(res => res.data)

const Report = () => {
  // Filter variable
  let date = new Date();
  const [ dateMin, setDateMin ] = useState(date.toISOString().split('T')[0]);
  const [ dateMax, setDateMax ] = useState(date.toISOString().split('T')[0]);
  const [ selectCustomer, setSelectCustomer ] = useState(null);
  const [ selectOrder, setSelectOrder ] = useState(null);
  const [ customers, setCustomers ] = useState([]);

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, { headers })
    .then(response => setCustomers(response.data))
    .catch(error => {
      console.error("There was an error!", error)
    });
  });

  const ordertype = [
    { value: "สด", label: "สด" }, 
    { value: "เชื่อ", label: "เชื่อ" },
    { value: "โอน", label: "โอน" } 
  ];
  // Fetch realtime order
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/orders`, userToken], fetcher, { refreshInterval: 1000 });
  if (error) return "Error fetching orders";
  if (!data) return "Loading...";
  
  const customersList = customers.length > 0
  && customers.map((item) => {
    return (
      { value: `${item.customer}`, label: `${item.customer}`}
    )
  })
  
  const min = Date.parse(dateMin);
  const max = Date.parse(dateMax);

  // Query and sorted Array - sorted by date
  const searchQuery = data.filter(search => {
    return (
      Date.parse(new Date(search.created_at).toISOString().split('T')[0]) >= min &&
      Date.parse(new Date(search.created_at).toISOString().split('T')[0]) <= max &&
      selectCustomer &&
      search.customer === selectCustomer.value &&
      selectOrder &&
      search.ordertype === selectOrder.value
  )}).sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  })
  
  return (
    <div>
      <Form>
        <Row>
          <Col>
            <Form.Label>เริ่มต้น</Form.Label>
            <Form.Control
              type="date"
              value={dateMin}
              onChange={(e) => setDateMin(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>สิ้นสุด</Form.Label>
            <Form.Control
              type="date"
              value={dateMax}
              onChange={(e) => setDateMax(e.target.value)}
            />
          </Col>
        </Row>  
      </Form>
      <br />
      <Form>
        <Row>
          <Col>
            <Form.Label>ลูกค้า</Form.Label>
            <CreatableSelect
              isClearable
              instanceId="customer"
              options={customersList} 
              value={selectCustomer}
              onChange={(selectedValue) => {
                setSelectCustomer(selectedValue)
              }}
            />
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
    <Table responsive striped hover>
      <thead>
        <tr>
          <th><center>วันที่</center></th>
          <th><center>ลูกค้า</center></th>
          <th><center>สินค้า</center></th>
          <th><center>จำนวน (บาท)</center></th>
          <th><center>ชนิดการซื้อ</center></th>
        </tr>
      </thead>
      <tbody>
      {searchQuery.map((item, index) => (
        <tr key={index}>
          <td>
            <ul>
              <center>
                <li style={{ listStyleType: "none" }}>
                  {new Date(item.created_at).toLocaleDateString("th-TH", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'                
                  })}
                </li>
                <li style={{ listStyleType: "none" }}>
                  {new Date(item.created_at).toLocaleTimeString("th-TH", {
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </li>
              </center>
            </ul>
          </td>
          <td><center>{item.customer}</center></td>
          <td><ul>{item.products.map((product,index) => (
            <li key={index}>{product.productname} = {product.quantity}</li>
            
          ))}</ul>
          </td>
          <td><center>
            <NumberFormat
              value={item.amount}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(value, props) => <div {...props}>{value}</div>}
            />
          </center></td>
          <td><center>{item.ordertype}</center></td>
        </tr>
      ))}
      </tbody>
    </Table>
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

export default Report;
