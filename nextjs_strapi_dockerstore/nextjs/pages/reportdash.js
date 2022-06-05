import React, { useState, useContext } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import useSWR from "swr";
import axios from "axios";
import Cookie from "js-cookie";
import CreatableSelect from "react-select/creatable";
import NumberFormat from 'react-number-format';

const userToken = Cookie.get("token")
const fetcher = (url, token) => axios.get(url, { headers: { Authorization: "Bearer " + token }}).then(res => res.data)

const Reportdash = () => {
  // Filter variable
  let date = new Date();
  const [ dateMin, setDateMin ] = useState(date.toISOString().split('T')[0]);
  const [ dateMax, setDateMax ] = useState(date.toISOString().split('T')[0]);
  const [ selectOrder, setSelectOrder ] = useState(null);

  const ordertype = [
    { value: "สด", label: "สด" }, 
    { value: "เชื่อ", label: "เชื่อ" },
    { value: "โอน", label: "โอน" } 
  ];
  // Fetch realtime order
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/orders`, userToken], fetcher, { refreshInterval: 1000 });
  if (error) return "Error fetching products";
  if (!data) return "Loading...";
  
  // Filter and Sorted Array - sorted by date
  const min = Date.parse(dateMin);
  const max = Date.parse(dateMax);

  const searchQuery = data.filter(search => {
    return (
      Date.parse(new Date(search.created_at).toISOString().split('T')[0]) >= min &&
      Date.parse(new Date(search.created_at).toISOString().split('T')[0]) <= max &&
      selectOrder &&
      search.ordertype === selectOrder.value
  )}).sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  })

  const mapoutput = searchQuery.reduce((map, order) => {
    var customer = order.customer
    var amount = +order.amount
    map[customer] = (map[customer] || 0) + amount
    return map
  }, {});
  
  const sumresult = Object.keys(mapoutput).map(customer => {
    return {
      customer: customer,
      amount: mapoutput[customer]
    }
  });

  const totalCash = sumresult.reduce((prev, curr) => {
    prev += curr.amount
    return prev;
  }, 0);
  
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
    <h2> 
      <NumberFormat
        value={totalCash}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'฿'}
        renderText={(value, props) => <div {...props}>รวมทั้งหมด {value} บาท</div>}
      />
    </h2>
    <br />
    <Table responsive striped hover>
      <thead>
        <tr>
          <th><center>ลูกค้า</center></th>
          <th><center>จำนวน (บาท)</center></th>
        </tr>
      </thead>
      <tbody>
      {sumresult.map((item, index) => (
        <tr key={index}>
          <td><center>{item.customer}</center></td>
          <td><center>
            <NumberFormat
              value={item.amount}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(value, props) => <div {...props}>{value}</div>}
            />
          </center></td>
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

export default Reportdash;
