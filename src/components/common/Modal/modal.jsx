import React from "react";

export default function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
}) {

  return (

    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.5)",
      }}
    >

      <div className="modal-dialog modal-dialog-centered">

        <div className="modal-content rounded-4 border-0 shadow">

          {/* HEADER */}
          <div className="modal-header">

            <h5 className="modal-title">
              {title}
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          {/* BODY */}
          <div className="modal-body">
            {children}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger"
              onClick={onConfirm}
            >
              {confirmText}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}