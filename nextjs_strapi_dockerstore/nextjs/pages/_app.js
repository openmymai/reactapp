import React, { useState, useEffect } from "react";
import Head from "next/head";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/global.css";


function MyApp(props) {
  const [ users, setUsers ] = useState(null);
  const [ cart, setCart ] = useState({
    items: [],
    total: 0,
  });
  const router = useRouter();

  useEffect(async() => {
    // Bootstrap 5 additional
    import("bootstrap/dist/js/bootstrap");
    const token = Cookie.get("token");
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { headers })
        .then(async (res) => {
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

  const addItem = (item) => {
    let { items } = cart;
    const newItem = items.find((i) => i.id === item.id);
    
    if (!newItem) {
      item.quantity = 1;
      setCart({
        items: [...items, item],
        total: cart.total + item.unitprice,
      });
      Cookie.set("cart", cart.items);
    } else {
      setCart({
        items: cart.items.map((item) => 
          item.id === newItem.id
          ? Object.assign({}, item, { quantity: item.quantity + 1 })
          : item
        ),
        total: cart.total + item.unitprice,
      })
      Cookie.set("cart", cart.items);
    }
  };

  const removeItem = (item) => {
    let { items } = cart;
    const newItem = items.find((i) => i.id === item.id);

    if (newItem.quantity > 1) {
      setCart({
        items: cart.items.map((item) => 
          item.id === newItem.id
          ? Object.assign({}, item, { quantity: item.quantity - 1 })
          : item
        ),
        total: cart.total - item.unitprice,
      });
      Cookie.set("cart", cart.items);
    } else {
      const items = [...cart.items];
      const index = items.findIndex((i) => i.id === newItem.id);

      items.splice(index, 1);
      setCart({
        items: items,
        total: cart.total - item.unitprice,
      });
      Cookie.set("cart", cart.items);
    }
  }

  const { Component, pageProps } = props;

  if (pageProps.protected && !users) {
    return (
      <Layout>Sorry, you don't have access</Layout>
    )
  }

  return (
    <AppContext.Provider
      value={{
        user: users,
        isAuthenticated: !!users,
        setUser: setUser,
        cart: cart,
        addItem: addItem,
        removeItem: removeItem,
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

export default MyApp;
