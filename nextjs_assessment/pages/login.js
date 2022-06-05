import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { login } from "../lib/auth";
import AppContext from "../context/AppContext";

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

  const onChange = (event) => {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
      <>
      <p></p>
      <Row>
        <Col sm="12" md={{ size: 5 }}>
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
              <Form>
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
                      onClick={() => {
                        setLoading(true);
                        login(data.identifier, data.password)
                          .then((res) => {
                            setLoading(false);
                            // set authed User in global context to update header/app state
                            appContext.setUser(res.data.user);
                          })
                          .catch((error) => {
                            setError(error.response.data);
                            setLoading(false);
                          });
                      }}
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