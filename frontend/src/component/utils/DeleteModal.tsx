import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function DeleteModal({ target, targetName, shouldShow, deleteFunc, closeModal }) {

  console.log("[delete modal]:", true)
  return (
    <>
      <Modal
        // {...props}
        show={shouldShow}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Are You Sure to Delete {targetName}?
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={()=>deleteFunc(target)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
