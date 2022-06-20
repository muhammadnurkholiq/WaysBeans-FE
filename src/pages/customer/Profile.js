// react
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import convertRupiah from "rupiah-format";
import dateFormat from "dateformat";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/customer/profile.css";

// component
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/Footer";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

// image
import Avatar from "../../assets/images/avatar.png";
import Icon from "../../assets/images/icon.png";
import Barcode from "../../assets/images/barcode.png";
import NoData from "../../assets/images/no data.jpg";

export default function Profile() {
  // useState
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [carts, setCarts] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    image: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // handle show modal
  const handleShow = () => {
    setShow(true);
  };

  // handle close modal
  const handleClose = () => {
    setShow(false);
  };

  // change value state form
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

  // handle edit
  const handleEdit = () => {
    setIsEdit(true);
  };

  // handle cancel edit
  const handleCancel = () => {
    setIsEdit(false);
  };

  // get profile
  const getProfile = async () => {
    try {
      const response = await API.get("/user");

      if (response.data.status === "Success") {
        setForm({
          name: response.data.data.name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          address: response.data.data.address,
        });
        setImage(response.data.data.image);
        setPreview(response.data.data.image);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get transaction
  const getTransaction = async () => {
    try {
      const response = await API.get("/transaction");

      console.log(response);

      if (response.data.status === "Success") {
        setTransaction(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle submit edit
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
          "Content-Type": "application/json",
        },
      };

      // data
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("name", form.name);
      formData.set("phone", form.phone);
      formData.set("address", form.address);

      // API update user
      const response = await API.patch("/user", formData, config);

      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        setLoading(false);
        setIsEdit(false);
        getProfile();
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      setLoading(false);
    }
  });

  useEffect(() => {
    getProfile();
    getCarts();
    getTransaction();
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
      <div className="profile">
        <Container>
          <Row>
            {!isEdit ? (
              <>
                {/* profile side */}
                <Col sm={6} className="profileSide">
                  <div className="profileHeader">
                    <h1>My Profile</h1>
                    <Button variant="" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  </div>

                  <Row>
                    {/* image side */}
                    <Col sm={6} className="imgSide">
                      {preview !==
                      "https://res.cloudinary.com/muhammad-nurkholiq/image/upload/v1654676551/null" ? (
                        <img src={preview} alt={form.name} />
                      ) : (
                        <img src={Avatar} alt={form.name} />
                      )}
                    </Col>
                    {/* detail profile side */}
                    <Col sm={6} className="detailSide">
                      {/* name */}
                      <div className="detail">
                        <h1 className="title">Full Name</h1>
                        <h1 className="titleData">{form.name}</h1>
                      </div>
                      {/* email */}
                      <div className="detail">
                        <h1 className="title">Email</h1>
                        <h1 className="titleData">{form.email}</h1>
                      </div>
                      {/* phone */}
                      <div className="detail">
                        <h1 className="title">Phone</h1>
                        {form.phone !== "" ? (
                          <h1 className="titleData">{form.phone}</h1>
                        ) : (
                          <h1 className="titleData">null</h1>
                        )}
                      </div>
                      {/* address */}
                      <div className="detail">
                        <h1 className="title">Address</h1>
                        {form.address !== "" ? (
                          <h1 className="titleData">{form.address}</h1>
                        ) : (
                          <h1 className="titleData">null</h1>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <>
                {/* profile side */}
                <Col sm={6} className="profileSide">
                  <div className="profileHeader">
                    <h1>My Profile</h1>

                    <div className="buttons">
                      <Button
                        variant=""
                        onClick={handleCancel}
                        className="btn-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant=""
                        onClick={handleShow}
                        className="btn-save"
                      >
                        Save Profile
                      </Button>
                    </div>
                  </div>

                  <Row>
                    {/* image side */}
                    <Col sm={6} className="imgSide">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        hidden
                      />
                      {preview !==
                      "https://res.cloudinary.com/muhammad-nurkholiq/image/upload/v1654676551/null" ? (
                        <img src={preview} alt={form.name} />
                      ) : (
                        <img src={Avatar} alt={form.name} />
                      )}
                      <label htmlFor="image">
                        <h1>Change profile photo</h1>
                      </label>
                    </Col>
                    {/* detail profile side */}
                    <Col sm={6} className="detailSide">
                      <form>
                        {/* name */}
                        <div className="detail">
                          <h1 className="title">Full Name</h1>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Input your name"
                          />
                        </div>
                        {/* email */}
                        <div className="detail">
                          <h1 className="title">Email</h1>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Input your email"
                            disabled
                          />
                        </div>
                        {/* phone */}
                        <div className="detail">
                          <h1 className="title">Phone</h1>
                          <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Input your phone"
                          />
                        </div>
                        {/* address */}
                        <div className="detail">
                          <h1 className="title">Address</h1>
                          <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Input your address"
                          />
                        </div>
                      </form>
                    </Col>
                  </Row>
                </Col>
              </>
            )}

            {/* transaction side */}
            <Col sm={6} className="transactionSide">
              <div className="transactionHeader">
                <h1>My Transaction</h1>
              </div>
              <div className="transactionList">
                {transaction.length >= 1 ? (
                  <>
                    {transaction.map((item) => (
                      <>
                        {/* content */}
                        <Row className="content">
                          <Col sm={12}>
                            {/* content */}
                            <Row>
                              {/* image side */}
                              <Col sm={3} className="imgSide">
                                <img src={item.product.image} alt="product" />
                              </Col>
                              {/* detail side */}
                              <Col sm={5} className="detailSide">
                                <h1 className="detailName">
                                  {item.product.name}
                                </h1>
                                <h1 className="detailDate">
                                  {dateFormat(
                                    item.createdAt,
                                    "dddd, d mmmm yyyy, HH:MM "
                                  )}
                                </h1>
                                <h1 className="detailPrice">
                                  Price: {convertRupiah.convert(item.price)}
                                </h1>
                                <h1 className="detailQty">Qty : 2</h1>
                                <h1 className="detailSubTotal">
                                  Sub Total :{" "}
                                  {convertRupiah.convert(item.totalPrice)}
                                </h1>
                              </Col>
                              {/* status side */}
                              <Col sm={4} className="statusSide">
                                <img
                                  src={Icon}
                                  alt="WaysBeans"
                                  className="iconApp"
                                />
                                <img
                                  src={Barcode}
                                  alt="WaysBeans"
                                  className="barcode"
                                />
                                <div
                                  className={
                                    item.status === "Waiting Approve"
                                      ? "status statusApprove"
                                      : item.status === "Approve"
                                      ? "status statusSuccess"
                                      : "status statusCancel"
                                  }
                                >
                                  {item.status}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ))}
                  </>
                ) : (
                  <div className="noData">
                    <img src={NoData} alt="No data product" />
                    <h1>Let's do some transactions</h1>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* footer */}
      <Footer />
      {/* modal */}
      <ConfirmationModal
        show={show}
        message="Are you sure you want to update your profile?"
        handleClose={handleClose}
        handleSubmit={(e) => handleSubmit.mutate(e)}
      />
    </>
  );
}
