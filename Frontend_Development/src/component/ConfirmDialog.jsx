import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirm"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || "Are you sure?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;