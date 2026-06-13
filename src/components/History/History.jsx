import React from "react";

export default function History({
  history = [],
  showHistory,
  setShowHistory,
}) {
  if (!showHistory) return null;

  return (
    <div className="card mt-3 p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          📜 Activity Log
        </h5>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            setShowHistory(false)
          }
        >
          ✖ Close
        </button>
      </div>

      {history.length === 0 ? (
        <div className="mb-0">
          No activity found
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="border-bottom py-2"
          >
            <div>
              <strong>
                {item.updatedBy ||
                  item.userName ||
                  "Unknown User"}
              </strong>
            </div>

            <div className="mt-1">
              Changed{" "}
              <b>{item.field}</b>
            </div>

            <div className="small mt-1">
              <span className="text-danger">
                {item.oldValue || "-"}
              </span>

              {" → "}

              <span className="text-success">
                {" "}
                {item.newValue || "-"}
              </span>
            </div>

            <small className="text-muted d-block mt-1">
              {item.timestamp?.seconds
                ? new Date(
                    item.timestamp.seconds *
                      1000
                  ).toLocaleString()
                : ""}
            </small>
          </div>
        ))
      )}
    </div>
  );
}