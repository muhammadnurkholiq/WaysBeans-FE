// react
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReactLoading from "react-loading";

// context
import { AuthContext } from "../../context/AuthContext";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/complain.css";

// component
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Footer from "../../components/Footer";
import Contact from "../../components/complain/Contact";
import Message from "../../components/complain/Message";

// socket io
import { io } from "socket.io-client";
let socket;

export default function CustomerComplain() {
  // context
  const [state] = useContext(AuthContext);
  const user = state.user;
  //  state
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [carts, setCarts] = useState([]);

  // get profile
  const getProfile = async () => {
    try {
      const response = await API.get("/user");

      if (response.data.status === "Success") {
        setImage(response.data.data.image);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get carts
  const getCarts = async () => {
    try {
      // API get carts
      const response = await API.get(`/carts`);

      // response
      if (response.data.status === "Success") {
        setCarts(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(
      process.env.REACT_APP_SERVER_URL ||
        "https://waysbeans-app-backend.herokuapp.com/" ||
        "http://localhost:5000",
      {
        auth: {
          token: localStorage.getItem("token"),
        },

        query: {
          id: state.user.id,
        },
      }
    );

    socket.on("new message", () => {
      socket.emit("load messages", contact?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });
    loadContact();

    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  // load contact
  const loadContact = () => {
    // emit event load admin contact
    socket.emit("load admin contact");
    // listen event to get admin contact
    socket.on("admin contact", (data) => {
      // manipulate data to add message property with the newest message
      const dataContact = {
        ...data,
        image: data.image,
        message:
          messages.length > 0
            ? messages[messages.length - 1].message
            : "Click here to start message",
      };
      setContacts([dataContact]);
    });
  };

  // click contact
  const onClickContact = (data) => {
    setContact(data);

    socket.emit("load messages", data.id);
  };

  // load message
  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      }
    });
  };

  // handle send message
  const onSendMessage = (e) => {
    e.preventDefault();

    const data = {
      idRecipient: contact.id,
      message: e.target.message.value,
    };

    socket.emit("send message", data);
    e.target.message.value = "";
  };

  useEffect(() => {
    getProfile();
    getCarts();
  }, []);

  return (
    <>
      {/* loading  */}
      {loading && (
        <div className="loadingContainer">
          <ReactLoading
            type="spinningBubbles"
            color="#613d2b"
            height={"15%"}
            width={"15%"}
            className="loading"
          />
        </div>
      )}
      {/* navbar */}
      {user.status === "customer" ? (
        <CustomerNavbar carts={carts} image={image} />
      ) : (
        <AdminNavbar />
      )}

      {/* content */}
      <div className="complain">
        <Container>
          <Row>
            {/* contact */}
            <Col sm={5} className="contactSide">
              <Contact
                dataContact={contacts}
                clickContact={onClickContact}
                contact={contact}
              />
            </Col>
            {/* message */}
            <Col sm={6} className="message">
              <Message
                contact={contact}
                messages={messages}
                user={state.user}
                sendMessage={onSendMessage}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* footer */}
      <Footer />
    </>
  );
}
