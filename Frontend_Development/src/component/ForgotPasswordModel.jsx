import React, { useState } from "react";

function ForgotPasswordModal({ onClose }) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = () => {
    if (!forgotEmail) {
      setMessage("Please enter your email to send OTP.");
      return;
    }
    alert("OTP sent to your email!");
    setOtpSent(true);
  };

  const handleOtpSubmit = () => {
    if (otpInput === "123456") {
      alert("OTP verified successfully!");
      setMessage("OTP verified. You may now reset your password.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div
      className="modal fade"
      id="forgotPasswordModal"
      tabIndex="-1"
      aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="forgotPasswordModalLabel">
              Forgot Password
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="email"
              placeholder="Enter your registered email"
              className="form-control mb-3"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            {!otpSent ? (
              <button className="btn btn-primary w-100" onClick={handleSendOtp}>
                Send OTP
              </button>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
                <button className="btn btn-success w-100" onClick={handleOtpSubmit}>
                  Submit
                </button>
              </>
            )}

            {message && (
              <div className="alert alert-info mt-3 text-center" role="alert">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
