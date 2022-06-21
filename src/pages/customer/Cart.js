// react
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/customer/cart.css";

// component
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/Footer";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

// image
import TrashIcon from "../../assets/images/trash-icon.png";
import NoData from "../../assets/images/no data.jpg";

export default function Cart() {
  // navigate
  let navigate = useNavigate();
  // state
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState({
    qty: "",
    subTotal: "",
  });
  const [image, setImage] = useState(null);

  // handle show modal
  const handleShow = (id) => {
    setShow(true);
    setId(id);
  };

  // handle close modal
  const handleClose = () => {
    setShow(false);
    setId(id);
  };

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

  // get cart
  const getCarts = async (e) => {
    try {
      // config
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      // API get cart
      const response = await API.get(`/carts`, config);

      // response
      setCarts(response.data.data);

      const totalqty = response.data.data.reduce(
        (sum, elem) => sum + elem.qty,
        0
      );

      const totalprice = response.data.data.reduce(
        (sum, elem) => sum + elem.qty * elem.product.price,
        0
      );

      setTotal({
        qty: totalqty,
        subTotal: totalprice,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // handle increase qty
  const handleIncrease = async (id, qty) => {
    try {
      // config
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // data
      const data = {
        qty: qty + 1,
      };

      // API update
      const response = await API.patch(`/cart/${id}`, data, config);

      // response
      if (response.data.status === "Success") {
        getCarts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle decrease qty
  const handleDecrease = async (id, qty) => {
    try {
      if (qty > 1) {
        // config
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        // data
        const data = {
          qty: qty - 1,
        };

        // API update
        const response = await API.patch(`/cart/${id}`, data, config);

        // response
        if (response.data.status === "Success") {
          getCarts();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle delete qty
  const handleDelete = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      handleClose();

      // API update
      const response = await API.delete(`/cart/${id}`);

      // response
      if (response.data.status === "Success") {
        getCarts();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "Client key here ...";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  // handle buy
  const handleBuy = useMutation(async () => {
    try {
      // config
      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-type": "application/json",
        },
      };

      // mapping data
      const dataCart = carts.map((item) => {
        // Get data from product
        return {
          idProduct: item.product.id,
          qty: item.qty,
          price: item.product.price * item.qty,
          totalPrice: total.subTotal,
        };
      });

      // Insert transaction data
      const response = await API.post("/transaction", dataCart, config);

      // Create variabel for store token payment from response here ...
      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

  // mapping cart
  const displayCart = carts.map((item) => {
    return (
      <div className="content" key={item.product.id}>
        <Row>
          <Col sm={2} className="img-side">
            <img src={item.product.image} alt={item.product.name} />
          </Col>
          <Col sm={7} className="order-info">
            <h1 className="order-name">{item.product.name}</h1>
            <div className="order-qty">
              <Button
                variant=""
                onClick={() => {
                  handleDecrease(item.product.id, item.qty);
                }}
              >
                -
              </Button>
              <div className="qty">{item.qty}</div>
              <Button
                variant=""
                onClick={() => {
                  handleIncrease(item.product.id, item.qty);
                }}
              >
                +
              </Button>
            </div>
          </Col>
          <Col sm={3} className="price-side">
            <h1>{convertRupiah.convert(item.product.price)}</h1>
            <button
              onClick={() => {
                handleShow(item.product.id);
              }}
            >
              <img src={TrashIcon} alt="delete" />
            </button>
          </Col>
        </Row>
      </div>
    );
  });

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
      <CustomerNavbar carts={carts} image={image} />
      {/* content */}
      <div className="cart">
        <Container>
          <Row>
            <Col sm={12} className="cart-title">
              <h1>My Cart</h1>
            </Col>
          </Row>
          {carts?.length >= 1 ? (
            <>
              <Row>
                <h1 className="order-title">Review Your Order</h1>
                {/* order-side */}
                <Col sm={7} className="order-side">
                  {displayCart}
                </Col>
                {/* total-side  */}
                <Col sm={4} className="total-side">
                  <Row className="subTotal-info">
                    <Col sm={8}>
                      <h1>Subtotal</h1>
                      <h1>Qty</h1>
                    </Col>
                    <Col sm={4} className="subTotal-value">
                      <h1>{convertRupiah.convert(total.subTotal)}</h1>
                      <h1>{total.qty}</h1>
                    </Col>
                  </Row>
                  <Row className="total-info">
                    <Col sm={8}>
                      <h1>Total</h1>
                    </Col>
                    <Col sm={4} className="total-value">
                      <h1>{convertRupiah.convert(total.subTotal)}</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} className="cart-pay">
                      <Button variant="" onClick={() => handleBuy.mutate()}>
                        Pay
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <div className="noData">
              <img src={NoData} alt="No data product" />
              <h1>Empty product</h1>
            </div>
          )}
        </Container>
      </div>
      {/* footer */}
      <Footer />
      {/* modal */}
      <ConfirmationModal
        show={show}
        message="Are you sure you want to delete this product?"
        handleClose={handleClose}
        handleSubmit={(e) => handleDelete.mutate(e)}
      />
    </>
  );
}
