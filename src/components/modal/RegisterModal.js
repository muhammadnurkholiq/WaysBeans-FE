// react
import { useState, useContext } from "react";
import { useMutation } from "react-query";
import { Modal, Button, Alert } from "react-bootstrap";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/components/modal.css";

export default function RegisterModal({
  showRegister,
  handleShowLogin,
  handleClose,
}) {
  // state
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
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
      const response = await API.post("/register", body, config);

      if (response.data.status === "Success") {
        const alert = <Alert variant="success">{response.data.message}</Alert>;
        setMessage(alert);
      } else {
        const alert = <Alert variant="danger">{response.data.message}</Alert>;
        setMessage(alert);
      }
    } catch (error) {
      const alert = <Alert variant="danger">Server error</Alert>;
      setMessage(alert);
      console.log(error);
    }
  });

  return (
    <Modal show={showRegister} onHide={handleClose}>
      <Modal.Header>
        <h1>Register</h1>
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
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="px-3 py-2 mt-3"
            required
          />
          <Button type="submit" className="btn btn-FormAuth mt-5">
            Register
          </Button>
          <p>
            Already have an account ? Klik{" "}
            <span onClick={handleShowLogin}>Here</span>
          </p>
        </form>
      </Modal.Body>
    </Modal>
  );
}
