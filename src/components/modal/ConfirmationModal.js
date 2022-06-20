// react
import { Modal, Button } from "react-bootstrap";

// css
import "../../assets/css/components/modalConfirmation.css";

export default function ConfirmationModal({
  show,
  message,
  handleClose,
  handleSubmit,
}) {
  return (
    <Modal show={show} onHide={handleClose} className="modal-confirmation">
      <h1 className="modal-title">Confirmation</h1>
      <h1 className="modal-info">{message}</h1>
      <div className="modal-btns">
        <Button variant="" onClick={handleSubmit} className="btn-yes">
          Yes
        </Button>
        <Button variant="" onClick={handleClose} className="btn-no">
          No
        </Button>
      </div>
    </Modal>
  );
}
