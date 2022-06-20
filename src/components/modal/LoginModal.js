// react
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Modal, Button, Alert } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// API
import { API } from "../../config/API";

// context
import { AuthContext } from "../../context/AuthContext";

// css
import "../../assets/css/components/modal.css";

export default function LoginModal({
  showLogin,
  handleShowRegister,
  handleClose,
}) {
  // context
  const [state, dispatch] = useContext(AuthContext);
  // state
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // change value state form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // config
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // data
      const body = JSON.stringify(form);

      // API login
      const response = await API.post("/login", body, config);

      if (response.data.status === "Success") {
        // send data to auth context
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });

        // notif
        NotificationManager.success(
          response.data.message,
          response.data.status,
          2000
        );

        // modal close
        handleClose();

        // set form
        setForm({
          email: "",
          password: "",
        });
      } else {
        const alert = <Alert variant="danger">{response.data.message}</Alert>;
        setMessage(alert);
      }

      // if(response)
    } catch (error) {
      const alert = <Alert variant="danger">Server error</Alert>;
      setMessage(alert);
      console.log(error);
    }
  });

  return (
    <Modal show={showLogin} onHide={handleClose}>
      <Modal.Header>
        <h1>Login</h1>
        {/* alert */}
        {message}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 mt-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="px-3 py-2 mt-3"
            minLength={5}
            required
          />
          <Button type="submit" className="btn btn-FormAuth mt-5">
            Login
          </Button>
          <p>
            Don't have an account ? Klik{" "}
            <span onClick={handleShowRegister}>Here</span>
          </p>
        </form>
      </Modal.Body>
    </Modal>
  );
}
