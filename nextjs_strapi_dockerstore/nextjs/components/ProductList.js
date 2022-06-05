import React, { useState, useContext } from "react";
import AppContext from "../context/AppContext";
import { Card, Row, Col, Button } from "react-bootstrap";
import useSWR from "swr";
import axios from "axios";
import Cookie from "js-cookie";

const userToken = Cookie.get("token")
const fetcher = (url, token) => axios.get(url, { headers: { Authorization: "Bearer " + token }}).then(res => res.data)

const ProductList = () => {
  const [ page, setPage ] = useState(1);
  const [ search, updateSearch ] = useState("");
  const appContext = useContext(AppContext);
    
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/products`, userToken], fetcher, { refreshInterval: 1000 });

  if (error) return "Error fetching products";
  if (!data) return "Loading...";

  const getPager = (totalItems, currentPage, pageSize) => {
		currentPage = currentPage || 1;
		pageSize = pageSize || 24;
		var totalPages = Math.ceil(totalItems / pageSize);
		var startPage, endPage;
		
		if (totalPages <= 10) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= 6) {
				startPage = 1;
				endPage = 10;
			} else if (currentPage + 4 >= totalPages) {
				startPage = totalPages - 9;
				endPage = totalPages;
			} else {
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
		}
		
		var startIndex = (currentPage - 1) * pageSize;
		var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
		var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
		
		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		};
  }
    const searchQuery = data.filter((query) => {
      return Object.keys(query).some(key => 
        (typeof query[key] === 'string' && query[key].toString().toLowerCase().includes(search))
        || (typeof query[key] === 'number') && query[key] === Number(search))
    })
    
    const pageSize = 24;
    const paging = getPager(searchQuery.length, page, pageSize);
    const pageOfItems = (searchQuery.slice(paging.startIndex, paging.endIndex + 1));
    
    return (
      <div>
        <br />
        <input
          type="text"
          placeholder="ค้นหา"
          autoFocus={true}
          onChange={(e) => updateSearch(e.target.value.toLocaleLowerCase())}
        />
        <br />
        <br />
        <hr />
        <Row>
          {pageOfItems.map((res) => (
            <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
              <Card style={{margin: "0 10px"}}>
                <Card.Img
                  variant="top"
                  style={{height: 400}}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`}
                />
                <Card.Body>
                  <h3>{res.productname}</h3>
                  <h1>ราคา {res.unitprice} บาท</h1>
                  <h3>จำนวน {res.unitinstock} </h3>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="outline-primary"
                    onClick={() => appContext.addItem(res)}
                    type="submit"
                  >
                    + หยิบใส่ตะกร้า
                  </Button>
                </Card.Footer>
              </Card>
              <br/>
            </Col>
          ))}
        </Row>

        <br />
        <nav aria-label="Page navigation">
          <ul className="pagination" style={{cursor: 'pointer'}}>
            <li className={paging.currentPage == 1 ? "page-item disabled" : "page-item"}>
              <a className="page-link" onClick={() => setPage(1)}>First</a>
            </li>
            <li className={paging.currentPage == 1 ? "page-item disabled" : "page-item"}>
              <a className="page-link" onClick={() => setPage(paging.currentPage - 1)}>Prev</a>
            </li>
            {paging.pages.map((page, index) => 
              <li key={index} className="page-item">
                <a className="page-link" onClick={() => setPage(page)}>{page}</a>
              </li>
            )}
            <li className={paging.currentPage == paging.totalPages ? "page-item disabled" : "page-item"}>
              <a className="page-link" onClick={() => setPage(paging.currentPage + 1)}>Next</a>
            </li>
            <li className={paging.currentPage == paging.totalPages ? "page-item disabled" : "page-item"}>
              <a className="page-link" onClick={() => setPage(paging.totalPages)}>Last</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  
}

export default ProductList;
