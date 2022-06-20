// react
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/admin/addProduct.css";

// component
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Footer from "../../components/Footer";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

// image
import PhotoProduct from "../../assets/images/photoProduct.png";

export default function AddProduct() {
  // navigate
  let navigate = useNavigate();
  // useState
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    image: "",
    name: "",
    stock: "",
    price: "",
    desc: "",
  });

  // show modal
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };

  // close modal
  const handleClose = (e) => {
    setShow(false);
  };

  // handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  // handle Submit
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      handleClose();
      setLoading(true);

      // config
      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      // data
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("name", form.name);
      formData.set("price", form.price);
      formData.set("desc", form.desc);
      formData.set("stock", form.stock);

      // API add product
      const response = await API.post("/product", formData, config);

      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        navigate("/product");
        setLoading(false);
      } else {
        setLoading(false);
        NotificationManager.error(
          response.data.message,
          response.data.status,
          3000
        );
        handleClose();
      }
    } catch (error) {
      // notif
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

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
      <div className="addProduct">
        <Container>
          <Row>
            {/* input side */}
            <Col sm={6} className="inputSide">
              <h1>Add Product</h1>

              <form>
                {/* input */}
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                />
                <input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                />
                <textarea
                  id="desc"
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Description Product"
                />
                <input
                  type="file"
                  id="image"
                  name="image"
                  hidden
                  onChange={handleChange}
                />
                <label htmlFor="image">
                  <h1>Photo Product</h1>
                  <img src={PhotoProduct} alt={form.name} />
                </label>
                <button onClick={handleShow}>Add Product</button>
              </form>
            </Col>

            {/* image side */}
            <Col sm={6} className="imgSide">
              <div className="imageField">
                {preview ? (
                  <img src={preview} alt={form.image} />
                ) : (
                  <h1>No Image</h1>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* modal */}
      <ConfirmationModal
        show={show}
        message="Are you sure you want to add this product?"
        handleClose={handleClose}
        handleSubmit={(e) => handleSubmit.mutate(e)}
      />
    </>
  );
}
