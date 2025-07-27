import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { BsCheckCircle, BsExclamationTriangle, BsXCircle } from "react-icons/bs";

const PurchaseMessage = ({ type = "info", message = "", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Optional icons for better UX
  const getIcon = () => {
    switch (type) {
      case "success":
        return <BsCheckCircle className="me-2 text-success" />;
      case "danger":
        return <BsXCircle className="me-2 text-danger" />;
      case "warning":
        return <BsExclamationTriangle className="me-2 text-warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-3">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <Alert
          variant={type}
          className="d-flex align-items-center gap-2 shadow-sm border rounded small mb-0"
        >
          {getIcon()}
          <span className="flex-grow-1">{message}</span>
        </Alert>
      </div>
    </div>
  );
};

export default PurchaseMessage;