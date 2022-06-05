import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Cookie from "js-cookie";
import axios from "axios";
import AppContext from "../context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);
  const router = useRouter();

  //register a new user
  const handleSubmit = (e) => {
    e.preventDefault();
    //prevent function from being ran on the server
    if (typeof window === "undefined") {
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/auth/local/register`, data)
        .then((res) => {
          //set token response from Strapi for server validation
          Cookie.set("token", res.data.jwt);

          //resolve the promise to set loading to false in SignUp form
          resolve(res);
          appContext.setUser(res.data.user);
          setLoading(false);
          //redirect back to home page for restaurance selection
          router.push("/");
        })
        .catch((error) => {
          //reject the promise and pass the error object back to the form
          setLoading(false);
          reject(error);
        });
    });
  };
  console.log(data)
  return (
    <>
    <br />
    <Container>
      <Row className="justify-content-md-center">
        <Col xs="5">
          <div className="paper">
            <section className="wrapper">
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
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                      disabled={loading}
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                      value={data.username}
                      type="text"
                      name="username"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      value={data.email}
                      type="email"
                      name="email"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </Form.Group>
                  <Form.Group style={{ marginBottom: 30 }}>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                      value={data.password}
                      type="password"
                      name="password"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button
                      style={{ float: "right", width: 120 }}
                      color="primary"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? "Loading.." : "Submit"}
                    </Button>
                  </Form.Group>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
};
export default Register;
