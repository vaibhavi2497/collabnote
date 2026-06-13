import React, { useRef } from "react";

import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../services/firebase";

import { addHistory } from "../../../features/notes/notes.service";

import Button from "../../../components/common/Button/Button";

export default function Editor({

  docId,
  user,
  darkMode,

  title,
  setTitle,

  description,
  setDescription,

  category,
  setCategory,

  color,
  setColor,

  dueDate,
  setDueDate,

  reminderTime,
  setReminderTime,

  handleAddNotes,
  editId,
  handleExportPDF,
 

}) {

  const typingTimeout =
    useRef(null);

  const timeoutRef =
    useRef(null);

  // =========================
  // UPDATE FIRESTORE
  // =========================

 const updateField = (
  field,
  value,
  oldValue
) => {

    if (!docId) return;

    clearTimeout(
      timeoutRef.current
    );

    timeoutRef.current =
      setTimeout(async () => {

        try {

          if (oldValue !== value) {
  await addHistory(
    field,
    value
  );
}

          await updateDoc(

            doc(
              db,
              "notes",
              docId
            ),

            {

              [field]: value,

              updatedAt:
                serverTimestamp(),

            }

          );

        }

        catch (error) {

          console.log(error);

        }

      }, 400);

  };

  // =========================
  // TYPING STATUS
  // =========================

  const updateTypingStatus =
    async () => {

      if (!docId || !user)
        return;

      try {

        // SET EDITING USER

        await updateDoc(

          doc(
            db,
            "notes",
            docId
          ),

          {

            editingBy:
              user.displayName ||
              user.email.split("@")[0],

            editingAt:
              serverTimestamp(),

          }

        );

        // CLEAR OLD TIMER

        clearTimeout(
          typingTimeout.current
        );

        // REMOVE EDITING STATUS
        // AFTER USER STOPS TYPING

        typingTimeout.current =
          setTimeout(async () => {

            try {

              await updateDoc(

                doc(
                  db,
                  "notes",
                  docId
                ),

                {

                  editingBy: "",

                }

              );

            }

            catch (error) {

              console.log(error);

            }

          }, 5000);

      }

      catch (error) {

        console.log(error);

      }

    };

  // =========================
  // RETURN
  // =========================

  return (

    <div
      className="card shadow-sm border-0 p-2 p-md-4"
      style={{
        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        color: darkMode ? "#f8fafc" : "#0f172a",
        border: darkMode
          ? "1px solid #334155"
          : "1px solid #e2e8f0",
        borderRadius: "16px",
      }}
    >
      <h3 className="mb-4">

        My Notes
      </h3>

      {/* TITLE + BUTTONS */}

      <div className="row g-2">
        <div className="col-12 col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Write title..."
            value={title}
           onChange={(e) => {
  const value = e.target.value;

  setTitle(value);

  updateField(
    "title",
    value,
    title
  );

  updateTypingStatus();
}}
          />
        </div>

        <div className="col-12 col-md-auto">
          <Button
            variant="success"
            className="w-100"
            onClick={handleAddNotes}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </div>

        <div className="col-12 col-md-auto">
          <Button
            variant="primary"
            className="w-100"
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* DESCRIPTION */}

      <div
  className="mt-3"
  style={{
    overflowX: "hidden",
  }}
>

      <ReactQuill
  theme="snow"
  style={{
    minHeight: "200px",
  }}
  

          value={description}

          onChange={(value) => {

            setDescription(
              value
            );

           updateField(
  "description",
  value,
  description
);

            updateTypingStatus();

          }}

          placeholder="Write your note..."
        />

      </div>

      {/* CATEGORY */}

      <select
        className="form-select mt-3"

        value={category}

        onChange={(e) => {

          setCategory(
            e.target.value
          );

          updateField(
  "category",
  e.target.value,
  category
);
          updateTypingStatus();

        }}
      >

        <option value="Personal">
          Personal
        </option>

        <option value="Work">
          Work
        </option>

        <option value="Study">
          Study
        </option>

        <option value="Ideas">
          Ideas
        </option>

      </select>

      {/* COLOR */}

      <div className="mt-3">

        <label
          className="form-label"
          style={{
            color: darkMode ? "#f8fafc" : "#0f172a",
          }}
        >
          Choose Note Color
        </label>

       <input
  type="color"
  className="form-control form-control-color w-100"
  style={{
    maxWidth: "100%",
    height: "50px",
  }}
          value={color}

          onChange={(e) => {

            setColor(
              e.target.value
            );

           updateField(
  "color",
  e.target.value,
  color
);

            updateTypingStatus();

          }}
        />

      </div>

      {/* DUE DATE */}

      <div className="mt-3">
        <label
          className="form-label"
          style={{
            color: darkMode ? "#f8fafc" : "#0f172a",
          }}
        >
          Due Date
        </label>

        <input
          type="date"

          className="form-control"

          value={dueDate}

          onChange={(e) => {

            setDueDate(
              e.target.value
            );

            updateField(
              "dueDate",
              e.target.value
            );

            updateTypingStatus();

          }}
        />
        <input
          type="time"
          className="form-control mt-2"
          value={reminderTime}
          onChange={(e) => {
            setReminderTime(
              e.target.value
            );

            updateField(
              "reminderTime",
              e.target.value
            );

            updateTypingStatus();
          }}
        />

      </div>

    </div>

  );

}