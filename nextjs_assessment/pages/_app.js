import React, { useState, useEffect } from "react";
//import App from "next/app";
import Head from "next/head";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import withData from "../lib/apollo";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/global.css";

function MyApp(props) {
  const [ users, setUsers ] = useState(null);

  useEffect(() => {
    const token = Cookie.get("token");

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          Cookie.remove("token");
          setUsers(null);
          return null;
        }
        const user = await res.json();
        setUsers(user);
      });
    }
  },[]);
  
  const setUser = (user) => {
    setUsers(user);
  };
    const { Component, pageProps } = props;
    return (
      <AppContext.Provider
        value={{
          user: users,
          isAuthenticated: !!users,
          setUser: setUser,
        }}
      >
        <Head>
          <link
            rel="stylesheet"
            crossOrigin="anonymous"
          />
        </Head>
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    );
}

export default withData(MyApp);
