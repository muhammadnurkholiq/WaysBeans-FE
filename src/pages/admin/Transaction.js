// react
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Container, Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/pages/admin/transaction.css";

// component
import AdminNavbar from "../../components/navbar/AdminNavbar";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

// image
import NoData from "../../assets/images/no data.jpg";

export default function Transaction() {
  // state
  const [id, setId] = useState(null);
  const [showCancel, setShowCancel] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  // modal cancel
  // handle Show modal cancel
  const handelShowCancel = (id) => {
    setShowCancel(true);
    setId(id);
  };

  // handle close modal cancel
  const handelCloseCancel = () => {
    setShowCancel(false);
    setId(null);
  };

  // modal approve
  // handle Show modal cancel
  const handelShowApprove = (id) => {
    setShowApprove(true);
    setId(id);
  };
  // handle close modal cancel
  const handelCloseApprove = () => {
    setShowApprove(false);
    setId(null);
  };

  // get product
  const getTransactions = async () => {
    try {
      const response = await API.get("/transactions");

      if (response.data.status === "Success") {
        setTransactions(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // pagination
  const productPerPage = 7;
  const pagesVisited = pageNumber * productPerPage;
  const pageCount = Math.ceil(transactions?.length / productPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayTransactions = transactions
    ?.slice(pagesVisited, productPerPage + pagesVisited)
    .map((item, index) => {
      return (
        <tr key={item.id}>
          {/* no */}
          <td className="tableNo">{index + 1}</td>
          {/* name */}
          <td className="tableName">{item.buyer.name}</td>
          {/* address */}
          <td className="tableAddress">
            {item.buyer.address === null ? "-" : item.buyer.address}
          </td>
          {/* phone */}
          <td className="tablePhone">
            {item.buyer.phone === null ? "-" : item.buyer.phone}
          </td>
          {/* product */}
          <td className="tableProduct">{item.product.name}</td>
          {/* id payment */}
          <td className="tableIdPayment">{item.idPayment}</td>
          {item.status === "Waiting Approve" ? (
            <td className="tableStatus status-waiting">{item.status}</td>
          ) : item.status === "Approve" ? (
            <td className="tableStatus status-success">{item.status}</td>
          ) : (
            <td className="tableStatus status-cancel">{item.status}</td>
          )}
          {/* action */}
          <td className="tableAction">
            <button
              className="btn btn-cancel"
              onClick={() => {
                handelShowCancel(item.id);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-approve"
              onClick={() => {
                handelShowApprove(item.id);
              }}
            >
              Approve
            </button>
          </td>
        </tr>
      );
    });

  // handle cancel
  const handleCancel = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      // config
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // get data
      let data = {
        status: "Cancel",
      };
      data = JSON.stringify(data);

      // API update transaction
      const response = await API.patch(`/transaction/${id}`, data, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          2000
        );
        getTransactions();
        handelCloseCancel();
        setLoading(false);
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  // handle approve
  const handleApprove = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      // config
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // get data
      let data = {
        status: "Approve",
      };
      data = JSON.stringify(data);

      // API update transaction
      const response = await API.patch(`/transaction/${id}`, data, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          2000
        );
        getTransactions();
        handelCloseApprove();
        setLoading(false);
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  useEffect(() => {
    getTransactions();
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
      <div className="transaction">
        <Container>
          <h1>Income Transaction</h1>
          <Row>
            <Col sm={12}>
              {transactions.length ? (
                <>
                  {transactions?.length > 7 && (
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
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Product</th>
                        <th>ID Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayTransactions}</tbody>
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
      {/* cancel */}
      <ConfirmationModal
        show={showCancel}
        message="Are you sure you want to cancel this transaction?"
        handleClose={handelCloseCancel}
        handleSubmit={(e) => handleCancel.mutate(e)}
      />
      {/* approve */}
      <ConfirmationModal
        show={showApprove}
        message="Are you sure you want to approve this transaction?"
        handleClose={handelCloseApprove}
        handleSubmit={(e) => handleApprove.mutate(e)}
      />
    </>
  );
}
