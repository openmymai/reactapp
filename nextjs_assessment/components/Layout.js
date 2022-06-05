import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import { logout } from "../lib/auth";
import AppContext from "../context/AppContext";

const Layout = (props) => {
  const title = "Assessment";
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
        <Nav className="navbar">
          <Nav.Item>
            <Link href="/">
              <a className="navbar-brand">ระบบทะเบียน</a>
            </Link>
          </Nav.Item>

          <Nav.Item className="ml-auto">
            {user ? (
              <div style={{color:'blue'}}>{user.username}</div>
            ) : (
              <div></div>
            )}
          </Nav.Item>
          <Nav.Item>
            {user ? (
              <Link href="/">
                <a
                  className="nav-link"
                  onClick={() => {
                    logout();
                    setUser(null);
                  }}
                >
                  Logout
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="nav-link">เข้าสู่ระบบ</a>
              </Link>
            )}
          </Nav.Item>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
}

export default Layout;