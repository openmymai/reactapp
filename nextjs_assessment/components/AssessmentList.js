import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";
import Image from "next/image";
import AppContext from "../context/AppContext";
import { Container } from "react-bootstrap";


const QUERY = gql`
 {
    assessments (sort: "item:asc") {
      id
      item
      title
      label
      description
      image {
        url
      }
      remark
    }
  }
`;

function AssessmentList(props) {
  const { loading, error, data } = useQuery(QUERY);
  const [ page, setPage ] = useState(1);
  
  const appContext = useContext(AppContext);
  const { isAuthenticated } = appContext;

  const getPager = (totalItems, currentPage, pageSize) => {
		currentPage = currentPage || 1;
		pageSize = pageSize || 25;
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

  
    if (error) return "Error loading assessments";
    if (loading) return <div></div>;
    if (data.assessments && data.assessments.length) {
      const searchQuery = data.assessments.filter((query) => {
        return Object.keys(query).some(key => 
          (typeof query[key] === 'string' && query[key].toString().toLowerCase().includes(props.search))
          || (typeof query[key] === 'number') && query[key] === Number(props.search))
      })


    const pageSize = 24;
    const paging = getPager(searchQuery.length, page, pageSize);
    const pageOfItems = (searchQuery.slice(paging.startIndex, paging.endIndex + 1));
    
    return (
      <div>
      {isAuthenticated ? (
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
        />
        <p></p>
        <ul className="image-list">
          {pageOfItems.map((res) => (
            <li key={res.id} className="image-list__item">
              <div className="image__flow thumbnail"> 
                <Link 
                  as={`/assessments/${res.id}`}
                  href={`/assessments?id=${res.id}`}
                >
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`} alt={res.title} style={{cursor: 'pointer'}}/>
                </Link>
                <h4>{res.title}</h4>
                <h4>หมายเลขกำกับ {" "} {res.label}</h4>
                <h5>รหัสทรัพย์สิน {" "} {res.item}</h5>
              </div>
            </li>
          ))}
        </ul>

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
      ) : (
        <>
        <Container>
          <h3 style={{textAlign: 'center'}}>ระบบทะเบียน เก็บรวบรวมสมบัติพระพุทธเจ้า ๒๘ พระองค์</h3>
          <Image
            src="/registration.png"
            alt="Registration"
            width={3334}
            height={1700}
          />
        </Container>
      </>
      )}
      </div>
    );
  }
}

export default AssessmentList;