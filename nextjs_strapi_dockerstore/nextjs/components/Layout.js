import React, { useContext } from "react";
import Head from "next/head";
import { Container, Navbar, Nav } from "react-bootstrap";
import { logout } from "../lib/auth";
import AppContext from "../context/AppContext";

const Layout = (props) => {
  const title = "Mongkon Store";
  const { user, setUser } = useContext(AppContext);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </Head>
      <header>
        <Navbar>
          <Container fluid>
            <Navbar.Brand href="/">ร้านค้ามงคล</Navbar.Brand>
            <Nav className="me-auto">
            {user ? (
              <Nav.Link href="/shopping">ซื้อสินค้า</Nav.Link>
            ) : (
              <div></div>
            )}
            </Nav>
            <Nav>
              <Nav.Link>
              {user ? (
                <div style={{color:'blue'}}>{user.username}</div>
              ) : (
                <div></div>
              )}
              </Nav.Link>
              {user ? (
                <Nav.Link href="/"
                  onClick={() => {
                    logout();
                    setUser(null);
                  }}
                  >
                  Logout
                </Nav.Link>
              ) : (
              <Nav.Link href="/login">เข้าสู่ระบบ</Nav.Link>
              )}
            </Nav>
          </Container>
        </Navbar>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
}

export default Layout;