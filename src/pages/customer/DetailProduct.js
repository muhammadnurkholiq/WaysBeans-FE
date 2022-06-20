// react
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// context
import { AuthContext } from "../../context/AuthContext";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/customer/detail-product.css";

// component
import AuthNavbar from "../../components/navbar/AuthNavbar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/Footer";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

export default function DetailProduct() {
  // context
  const [state] = useContext(AuthContext);
  const user = state.user;
  // id params
  const { id } = useParams();
  // state
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [carts, setCarts] = useState([]);
  const [show, setShow] = useState(false);
  const [type, setType] = useState(null);
  const [image, setImage] = useState(null);

  // handle add cart show
  const handleAddShow = () => {
    setShow(true);
    setType("add cart");
  };

  // handle remove cart show
  const handleRemoveShow = () => {
    setShow(true);
    setType("remove cart");
  };

  // handle close
  const handleClose = () => {
    setShow(false);
    setType(null);
  };

  // get product
  const getProduct = async () => {
    try {
      const response = await API.get(`/product/${id}`);

      // response
      if (response.data.status === "Success") {
        setProduct(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // get cart
  const getCart = async () => {
    try {
      const response = await API.get(`/cart/${id}`);

      // response
      if (response.data.status === "Success") {
        setCart(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get profile
  const getProfile = async () => {
    try {
      const response = await API.get("/user");

      if (response.data.status === "Success") {
        setImage(response.data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add cart
  const handleAddCart = useMutation(async (e) => {
    try {
      e.preventDefault();
      handleClose();
      setLoading(true);

      // API add cart
      const response = await API.post(`/cart/${id}`);

      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        setLoading(false);
        setType(null);
        getCart();
        getCarts();
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
      setLoading(false);
    }
  });

  // remove cart
  const handleRemoveCart = useMutation(async (e) => {
    try {
      e.preventDefault();
      handleClose();
      setLoading(true);

      // API add cart
      const response = await API.delete(`/cart/${cart.id}`);

      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        setLoading(false);
        setType(null);
        getCart();
        getCarts();
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    getProduct();
    getProfile();
    getCart();
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
      {/* navbar  */}
      {user.status === "customer" ? (
        <CustomerNavbar carts={carts} image={image} />
      ) : user.status === "admin" ? (
        <AdminNavbar />
      ) : (
        <AuthNavbar />
      )}
      {/* content */}
      <div className="detailProduct">
        <Container>
          <Row>
            <Col sm={6} className="imgSide">
              <img src={product.image} alt={product.name} />
            </Col>
            <Col sm={6} className="detailSide">
              <h1 className="detailName">{product.name}</h1>
              <p className="detailStock">Stock : {product.stock}</p>
              <div className="detailDesc">{product.desc}</div>
              <p className="detailPrice">
                {convertRupiah.convert(product.price)}
              </p>
              {user.status === "customer" ? (
                <>
                  {cart ? (
                    <Button variant="" onClick={handleRemoveShow}>
                      Remove from cart
                    </Button>
                  ) : (
                    <Button variant="" onClick={handleAddShow}>
                      Add cart
                    </Button>
                  )}
                </>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      {/* footer */}
      <Footer />
      {/* modal */}
      {type === "add cart" ? (
        <ConfirmationModal
          show={show}
          handleClose={handleClose}
          message="Are you sure you want to add this product to cart?"
          handleSubmit={(e) => handleAddCart.mutate(e)}
        />
      ) : (
        <ConfirmationModal
          show={show}
          handleClose={handleClose}
          message="Are you sure you want to remove this product from cart?"
          handleSubmit={(e) => handleRemoveCart.mutate(e)}
        />
      )}
    </>
  );
}
