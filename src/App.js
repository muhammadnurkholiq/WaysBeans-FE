// react
import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// API
import { API, setAuthToken } from "./config/API";

// context
import { AuthContext } from "./context/AuthContext";

// pages
import Landing from "./pages/Landing";
// customer
import Cart from "./pages/customer/Cart";
import DetailProduct from "./pages/customer/DetailProduct";
import Profile from "./pages/customer/Profile";
import CustomerComplain from "./pages/customer/CustomerComplain";
// admin
import Transaction from "./pages/admin/Transaction";
import AdminComplain from "./pages/admin/AdminComplain";
import Product from "./pages/admin/Product";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

export default function App() {
  // context
  const [state, dispatch] = useContext(AuthContext);
  // navigate
  let navigate = useNavigate();

  // set token
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate("/");
    } else {
      navigate("/");
    }
  }, [state]);

  // check user
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // check token valid
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;

      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Call function check user with useEffect didMount here ...
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* customer */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/detailProduct/:id" element={<DetailProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/customerComplain" element={<CustomerComplain />} />

      {/* admin */}
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/adminComplain" element={<AdminComplain />} />
      <Route path="/product" element={<Product />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/editProduct/:id" element={<EditProduct />} />
    </Routes>
  );
}
