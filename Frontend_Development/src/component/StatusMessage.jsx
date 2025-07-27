import React, { useEffect, useRef } from "react";
import { Alert, Button } from "react-bootstrap";

const StatusMessage = ({ type = "info", message = "", onClose }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 3000);
    return () => clearTimeout(timerRef.current);
  }, [onClose]);

  const handleManualClose = () => {
    clearTimeout(timerRef.current);
    onClose();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1055,
      }}
    >
      <div className="bg-white p-3 rounded shadow-lg w-100 mx-3 text-center" style={{ maxWidth: "400px" }}>
        <Alert variant={type} className="mb-3 small">
          {message}
        </Alert>
        <Button variant="outline-primary" size="sm" onClick={handleManualClose}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default StatusMessage;