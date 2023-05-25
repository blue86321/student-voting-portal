import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function DeleteModal(props) {
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <>

      {/* <Button variant="outline-danger" onClick={handleShow}>
        Delete
      </Button> */}

      <Modal
        {...props}
        // onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton >
          <Modal.Title className="text-center">Are You Sure to Delete This User?</Modal.Title>
        </Modal.Header>
        
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onHide} >
            Cancel
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
