import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Form, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Cookie from "js-cookie";
import AppContext from "../context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

function Login(props) {
  const [data, updateData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    //prevent function from being ran on the server
    if (typeof window === "undefined") {
      return;
    }
  
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/auth/local/`, data)
        .then((res) => {
          //set token response from Strapi for server validation
          Cookie.set("token", res.data.jwt);
  
          //resolve the promise to set loading to false in SignUp form
          resolve(res);
          setLoading(false);
          appContext.setUser(res.data.user);
          //redirect back to home page for restaurance selection
          router.push("/");
        })
        .catch((error) => {
          //reject the promise and pass the error object back to the form
          setError(error.response.data);
          setLoading(false);
          reject(error);
        });
    });
  };

  const onChange = (event) => {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
      <>
      <br />
      <Row className="justify-content-md-center">
        
        <Col xs="5">
          <div>
            <section>
              {Object.entries(error).length !== 0 &&
                error.constructor === Object &&
                error.message.map((error) => {
                  return (
                    <div
                      key={error.messages[0].id}
                      style={{ marginBottom: 10 }}
                    >
                      <small style={{ color: "red" }}>
                        {error.messages[0].message}
                      </small>
                    </div>
                  );
                })}
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    onChange={(event) => onChange(event)}
                    name="identifier"
                    style={{ height: 50, fontSize: "1.2em" }}
                  />
                </Form.Group>
                <Form.Group style={{ marginBottom: 30 }}>
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    onChange={(event) => onChange(event)}
                    type="password"
                    name="password"
                    style={{ height: 50, fontSize: "1.2em" }}
                  />
                </Form.Group>

                <Form.Group>
                  <Button
                    style={{ float: "right", width: 120 }}
                    color="primary"
                    type="submit"
                  >
                    {loading ? "Loading... " : "Submit"}
                  </Button>
                </Form.Group>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Login;