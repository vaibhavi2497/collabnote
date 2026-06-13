import React, { useState } from "react";
import Button from "../../../components/common/Button/Button";
import { FiEdit, FiTrash2, FiStar, FiShare2 } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";
import { LuPinOff } from "react-icons/lu";
import { MdArchive } from "react-icons/md";
import Modal from "../../common/Modal/modal";
import { toast } from "react-toastify";

export default function NoteCard({
  note,
  darkMode,
  user,
  handleFavorite,
  handlePinNote,
  handleShare,
  handleEditNotes,
  handleArchiveNote,
  handleHistory,
  handleDeleteNotes,
}) {

  // Safe values

  const formattedDate = note?.createdAt
    ? new Date(
      note.createdAt.seconds
        ? note.createdAt.seconds * 1000
        : note.createdAt
    ).toLocaleString()
    : "No Date";

  // Username
  const username =
    note?.editingBy ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Anonymous User";


  const [showShareModal, setShowShareModal] =
    useState(false);

  const [shareEmail, setShareEmail] =
    useState("");

    console.log("Description:", note?.description);

  return (

    <li
      className={`list-group-item shadow-sm mb-3 
      ${darkMode ? " text-light" : ""}
      ${note?.dueDate &&
          new Date(note.dueDate) < new Date()
          ? "border border-danger"
          : "border-0"
        }`}
      style={{
        borderRadius: "12px",
        padding: "18px",
        backgroundColor: note?.color || "#f8f9fa",
        transition: "0.3s",
      }}
    >

      <div className="d-flex justify-content-between align-items-start">

        {/* LEFT SIDE */}
        <div>

          {/* USER NAME */}
          <small className="fw-bold d-block mb-1">
            👤 {username}
          </small>

          {/* TITLE */}
          <h5 className="mb-1">
            📝 {note?.title}
          </h5>

          {/* EDITING STATUS */}
          {note?.editingBy &&
            note.editingBy !==
            (user.displayName ||
              user.email.split("@")[0]) && (
              <small className="text-success fw-bold d-block mb-2">
                {note.editingBy} is editing...
              </small>
            )}

          {/* DATE */}
          <p className="mb-1">
            {formattedDate}
          </p>

          {/* DESCRIPTION */}
          <div
            className="mt-2 quill-preview"
            style={{
              maxHeight: "120px",
              overflow: "hidden",
              lineHeight: "1.6",
            }}
            dangerouslySetInnerHTML={{
              __html: note?.description || "",
            }}
          />

          {/* CATEGORY */}
          <span
            className={`badge ${note?.category === "Work"
              ? "bg-danger"
              : note?.category === "Study"
                ? "bg-success"
                : note?.category === "Ideas"
                  ? "bg-warning text-dark"
                  : "bg-primary"
              }`}
          >
            {note?.category || "General"}
          </span>

          {/* DUE DATE */}
          <div className="mt-2">
            <small
              className={
                note?.dueDate &&
                  new Date(
                    `${note.dueDate}T${note.reminderTime || "23:59"}`
                  ) < new Date()
                  ? "text-danger fw-bold"
                  : "text-success"
              }
            >
              ⏰ Due: {note?.dueDate || "No Date"}

              {note?.reminderTime &&
                ` at ${note.reminderTime}`}
            </small>
          </div>

        </div>

        {/* RIGHT BUTTONS */}
        <div className="d-flex gap-2 flex-wrap">

          {/* FAVORITE */}
          <Button
            variant={
              note?.favorite
                ? "warning"
                : "light"
            }

            size="sm"

            iconOnly

            onClick={() =>
              handleFavorite(
                note.id,
                note.favorite
              )
            }
          >
            <FiStar />
          </Button>

          {/* PIN */}
          <Button
            variant={note?.pinned ? "danger" : "primary"}
            size="sm"
            iconOnly
            onClick={() => handlePinNote(note.id, note.pinned)}
          >
            {note?.pinned
              ? <LuPinOff />
              : <BsPinAngleFill />
            }
          </Button>
          {/* SHARE */}

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setShowShareModal(true)
            }
          >
            <FiShare2 />
          </Button>

          <button
  className="btn btn-info btn-sm"
  onClick={() => handleHistory(note)}
>
  📜 Activity
</button>

          {/* EDIT */}
          <Button
            variant="warning"
            size="sm"
            iconOnly
            onClick={() => handleEditNotes(note)}
          >
            <FiEdit />
          </Button>

          {/* ARCHIVE */}
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            onClick={() => handleArchiveNote(note.id)}
          >
            < MdArchive />
          </Button>

          {/* DELETE */}
          <Button
            variant="danger"
            size="sm"
            iconOnly
            onClick={() => handleDeleteNotes(note.id)}
          >
            <FiTrash2 />
          </Button>

        </div>

      </div>
      {showShareModal && (
        <Modal
          title="Share Note"
          confirmText="Share"
          onClose={() => {
            setShowShareModal(false);
            setShareEmail("");
          }}
          onConfirm={async () => {
            try {

              await handleShare(
                note.id,
                shareEmail
              );

              toast.success(
                `Note shared with ${shareEmail}`
              );

              setShareEmail("");

              setShowShareModal(false);

            } catch (error) {

              toast.error(
                error.message
              );

            }
          }}
        >
          <input
            type="email"
            className="form-control"
            placeholder="Enter email address"
            value={shareEmail}
            onChange={(e) =>
              setShareEmail(
                e.target.value
              )
            }
          />
        </Modal>
      )}

    </li>
  );
}