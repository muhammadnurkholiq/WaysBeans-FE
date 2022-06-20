// react
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// context
import { AuthContext } from "../context/AuthContext";

// API
import { API } from "../config/API";

// css
import "../assets/css/pages/landing.css";

// component
import AuthNavbar from "../components/navbar/AuthNavbar";
import CustomerNavbar from "../components/navbar/CustomerNavbar";
import AdminNavbar from "../components/navbar/AdminNavbar";
import Footer from "../components/Footer";

// image
import Jumbotron from "../assets/images/Jumbotron.png";
import NoData from "../assets/images/no data.jpg";

export default function Landing() {
  // context
  const [state] = useContext(AuthContext);
  const user = state.user;
  // navigate
  let navigate = useNavigate();
  // state
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

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

  // get products
  const getProducts = async () => {
    try {
      const response = await API.get("/products");

      // response
      if (response.data.status === "Success") {
        setProducts(response.data.data);
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
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // pagination
  const productPerPage = 4;
  const pagesVisited = pageNumber * productPerPage;
  const pageCount = Math.ceil(products?.length / productPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayProducts = products
    ?.slice(pagesVisited, productPerPage + pagesVisited)
    .map((item, index) => {
      return (
        <Col md={3} key={item.id}>
          <Card
            onClick={() => {
              navigate(`/detailProduct/${item.id}`);
            }}
          >
            <div className="imgHover">
              <Card.Img variant="top" src={item.image} alt={item.name} />
            </div>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{convertRupiah.convert(item.price)}</Card.Text>
              <Card.Text>Stock : {item.stock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    });

  useEffect(() => {
    getProfile();
    getProducts();
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
      ) : user.status === "admin" ? (
        <AdminNavbar />
      ) : (
        <AuthNavbar />
      )}

      {/* content  */}
      <div className="landing">
        <Container>
          {/* row 1 */}
          <Row>
            <Col md={12}>
              {/* jumbotron */}
              <div className="jumbotron">
                <img src={Jumbotron} alt="jumbotron" />
              </div>
            </Col>
          </Row>

          {/* row 2 */}
          <Row>
            <div className="product">
              {products.length >= 1 ? (
                <>{displayProducts}</>
              ) : (
                <div className="noData">
                  <img src={NoData} alt="No data product" />
                  <h1>Empty product</h1>
                </div>
              )}
            </div>
          </Row>
          {products.length > 4 && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel="..."
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          )}
        </Container>
      </div>
      {/* footer  */}
      <Footer />
    </>
  );
}
