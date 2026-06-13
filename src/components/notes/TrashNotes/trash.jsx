import React, { useState } from "react";
import Modal from "../../common/Modal/modal";
import EmptyState from "../../common/EmptyState";
export default function Trash({
  darkMode,
  handlePermanentDelete,
  handleRestoreNote,
  trashNotes = [],
}) {

  const [showModal, setShowModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const confirmDelete = () => {
    handlePermanentDelete(selectedNoteId);
    setShowModal(false);
  };

  return (

    <div className="mt-5">

      <h3 className="mb-4">
        🗑️ Trash Notes
      </h3>

      {trashNotes.length === 0 ? (

        <EmptyState
          title="Trash is Empty"
          subtitle="Deleted notes will appear here."
          icon="🗑️"
          darkMode={darkMode}
        />

      ) : (

        trashNotes.map((note) => (

          <div
            key={note.id}
            className="card p-3 mb-3"
            style={{
              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
              color: darkMode ? "#f8fafc" : "#0f172a",
              border: darkMode
                ? "1px solid #334155"
                : "1px solid #e2e8f0",
            }}
          >

            <h5>{note.title}</h5>

            <div
              dangerouslySetInnerHTML={{
                __html: note.description,
              }}
            />

            <div className="d-flex gap-2 mt-2">

              <button
                className="btn btn-success btn-sm"
                onClick={() => handleRestoreNote(note.id)}
              >
                Restore
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setShowModal(true);
                }}
              >
                Delete Permanently
              </button>

            </div>

          </div>

        ))

      )}

      {showModal && (

        <Modal
          title="Delete Note"
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        >

          <p>
            Are you sure you want to permanently delete this note?
          </p>

        </Modal>

      )}

    </div>

  );
}