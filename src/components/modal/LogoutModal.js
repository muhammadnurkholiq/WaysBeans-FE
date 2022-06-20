// react
import { Modal, Button } from "react-bootstrap";

// css
import "../../assets/css/components/modalConfirmation.css";

export default function LogoutModal({ showLogOut, handleClose, handleLogout }) {
  return (
    <Modal
      show={showLogOut}
      onHide={handleClose}
      className="modal-confirmation"
    >
      <h1 className="modal-title">Confirmation</h1>
      <h1 className="modal-info">Are you sure you want to logout?</h1>
      <div className="modal-btns">
        <Button variant="" onClick={handleLogout} className="btn-yes">
          Yes
        </Button>
        <Button variant="" onClick={handleClose} className="btn-no">
          No
        </Button>
      </div>
    </Modal>
  );
}
