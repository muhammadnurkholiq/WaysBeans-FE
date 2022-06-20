// react
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useMutation } from "react-query";
import { NotificationManager } from "react-notifications";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import convertRupiah from "rupiah-format";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/admin/product.css";

// component
import AdminNavbar from "../../components/navbar/AdminNavbar";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

// image
import NoData from "../../assets/images/no data.jpg";

export default function Product() {
  // navigate
  let navigate = useNavigate();
  // state
  const [id, setId] = useState(0);
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const handleShowDelete = (id) => {
    setShow(true);
    setId(id);
  };

  const handleCloseDelete = () => setShow(false);

  // get product
  const getProducts = async () => {
    try {
      const response = await API.get("/products");

      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // pagination
  const productPerPage = 3;
  const pagesVisited = pageNumber * productPerPage;
  const pageCount = Math.ceil(products?.length / productPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayProducts = products
    ?.slice(pagesVisited, productPerPage + pagesVisited)
    .map((item, index) => {
      return (
        <tr key={item.id}>
          <td className="tableNo">{index + 1}</td>
          <td className="tableImage">
            <img src={item.image} alt={item.name} loading="lazy" />
          </td>
          <td className="tableName">{item.name}</td>
          <td className="tableStock">{item.stock}</td>
          <td className="tablePrice">{convertRupiah.convert(item.price)}</td>
          <td className="tableDesc">{item.desc}</td>
          <td className="tableAction">
            <button
              className="btn btn-edit"
              onClick={() => {
                navigate(`/editProduct/${item.id}`);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => {
                handleShowDelete(item.id);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

  // handle delete
  const handleDelete = useMutation(async (e) => {
    try {
      e.preventDefault();
      handleCloseDelete();
      setLoading(true);

      // config
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      // API delete
      const response = await API.delete(`/product/${id}`, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );

        handleCloseDelete();
        setLoading(false);
        getProducts();
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  useEffect(() => {
    getProducts();
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
      <AdminNavbar />
      {/* content */}
      <div className="product">
        <Container>
          <div className="productHeader">
            <h1>Product</h1>
            <button
              onClick={() => {
                navigate("/addProduct");
              }}
            >
              Add Product
            </button>
          </div>
          <Row>
            <Col sm={12}>
              {products.length ? (
                <>
                  {products?.length > 3 && (
                    <>
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
                    </>
                  )}
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Desc</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayProducts}</tbody>
                  </table>
                </>
              ) : (
                <div className="noData">
                  <img src={NoData} alt="No data product" />
                  <h1>Empty product</h1>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      {/* modal */}
      <ConfirmationModal
        show={show}
        message="Are you sure you want to delete this product?"
        handleClose={handleCloseDelete}
        handleSubmit={(e) => handleDelete.mutate(e)}
      />
    </>
  );
}
