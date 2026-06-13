import React, { useState, useRef, useEffect } from "react";

import { Navigate, useOutletContext } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";

import { useNotes } from "../../features/notes/notes.hooks";

import { filterNotes, sortPinnedNotes, exportNotesPDF, } from "../../features/notes/notes.utils";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Editor from "../../components/notes/NoteEditor/Editor";

import Trash from "../../components/notes/TrashNotes/trash";

import NoteCard from "../../components/notes/NoteCard/NoteCard";

import Loader from "../../components/common/Loader/Loader";

import { toast } from "react-toastify";

import History from "../../components/History/History";


import { collection, onSnapshot, query, orderBy,} from "firebase/firestore";
import { db } from "../../services/firebase";
export default function Home() {

  const { user, loading } = useAuth();
  const { darkMode } = useTheme();
  const { search } = useOutletContext();
  // console.log(search);
  // =========================
  // NOTES HOOK
  // =========================
  // console.log("FILTER FUNCTION:", filterNotes);
  const {
    savedNotes,
    trashNotes,
    archiveNotes,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentDelete,
    toggleFavorite,
    togglePin,
    archiveNote,
    restoreArchive,
    shareNote,
    setEditingUser,

  } = useNotes(user?.email);

  // =========================
  // STATES
  // =========================

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] =
    useState("Personal");

  const [color, setColor] =
    useState("#e67184");

  const [dueDate, setDueDate] =
    useState("");

  const [reminderTime, setReminderTime] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("notes");

  // const [isOpen] = useState(false);

  // const [isMobile, setIsMobile] =   useState(window.innerWidth <= 768);

  const [orderedNotes, setOrderedNotes] = useState([]);

  const firedReminders = useRef(new Set());

const [history, setHistory] =
  useState([]);

  const [showHistory, setShowHistory] = useState(false);
const [historyNoteId, setHistoryNoteId] = useState(null);

  const [currentNote, setCurrentNote] =
  useState(null);

  const handleHistory = (note) => {
  setHistoryNoteId(note.id);
  setShowHistory(true);
};


  // =========================
  // MOBILE
  // console.log("USER:", user);
  // console.log("EMAIL:", user?.email);
  // console.log("SAVED NOTES:", savedNotes);
  // // =========================

  // useEffect(() => {

  //   const handleResize = () => {

  //     setIsMobile(
  //       window.innerWidth <= 768
  //     );

  //   };

  //   window.addEventListener(
  //     "resize",
  //     handleResize
  //   );

  //   return () => {

  //     window.removeEventListener(
  //       "resize",
  //       handleResize
  //     );

  //   };

  // }, []);


  // ==========================
  // Drag Drop
  // ==========================
  useEffect(() => {
    setOrderedNotes(
      sortPinnedNotes(
        filterNotes(savedNotes, search)
      )
    );
  }, [savedNotes, search]);

  // ==========================
  // Notification Due Date
  // ==========================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      savedNotes.forEach((note) => {
        if (
          note.dueDate &&
          note.reminderTime
        ) {
          const reminderDate = new Date(
            `${note.dueDate}T${note.reminderTime}`
          );

          if (
            Math.abs(now - reminderDate) < 60000 &&
            !firedReminders.current.has(note.id)
          ) {
            new Notification("🔔 Reminder", {
              body: note.title,
            });

            firedReminders.current.add(note.id);
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [savedNotes]);

// =======================================
//      History
// =======================================
useEffect(() => {
  if (!historyNoteId) return;
  const q = query(
    collection(
  db,
  "notes",
  historyNoteId,
  "history"
),
    orderBy(
      "timestamp",
      "desc"
    )
  );

  const unsub = onSnapshot(
    q,
    (snapshot) => {
      setHistory(
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        )
      );
    }
  );

  return () => unsub();
}, [historyNoteId]);
  // =========================
  // LOADING
  // =========================

  if (loading) {

    return <Loader />;

  }

  if (!user) {

    return <Navigate to="/" />;

  }

  // =========================
  // ADD / UPDATE NOTE
  // =========================

  const handleAddNote = async () => {

    try {

      if (!title.trim()) {

        toast.error("Enter title");

        return;

      }

      if (editId) {

  await updateNote({
    id: editId,
    title,
    description,
    category,
    color,
    dueDate,
    reminderTime,

    userName:
      user.displayName ||
      user.email.split("@")[0],

    previousNote:
      currentNote,
  });

  toast.success("Note Updated");

} else {

  await addNote({
    user,
    title,
    description,
    category,
    color,
    dueDate,
    reminderTime,
  });

  toast.success("Note Added");
}

     

      // RESET

      setTitle("");
      setDescription("");
      setCategory("Personal");
      setColor("#e67184");
      setDueDate("");
      setEditId(null);
      setCurrentNote(null);
      setHistory([]);

    }

    catch (error) {

      toast.error(error.message);

    }

  };

  // =========================
  // EDIT NOTE
  // =========================

  const handleEdit = async (note) => {

  setCurrentNote(note);

  setEditId(note.id);

  setTitle(note.title || "");
  setDescription(note.description || "");
  setCategory(note.category || "Personal");
  setColor(note.color || "#e67184");
  setDueDate(note.dueDate || "");
  setReminderTime(note.reminderTime || "");

  await setEditingUser(
    note.id,
    user.displayName ||
      user.email.split("@")[0]
  );
};

  // =========================
  // DRAG
  // =========================
  const handleDragEnd = (result) => {
    console.log("DRAG END FIRED");
    console.log(result);

    if (!result.destination) return;

    const items = [...orderedNotes];

    const [moved] = items.splice(
      result.source.index,
      1
    );

    items.splice(
      result.destination.index,
      0,
      moved
    );

    setOrderedNotes(items);
  };

  // =========================
  // RETURN
  // =========================

  return (

    <>
     
        <div
          className="container-fluid py-4"
          style={{
            backgroundColor: darkMode
              ? "#0f172a"
              : "#f8fafc",
            minHeight: "100vh",
            color: darkMode
              ? "#f8fafc"
              : "#0f172a",
          }}
        >



          {/* PAGE CONTENT */}

          <div className="col-lg-8">
  <Editor
    docId={editId}
    title={title}
    setTitle={setTitle}
    description={description}
    setDescription={setDescription}
    category={category}
    setCategory={setCategory}
    color={color}
    setColor={setColor}
    dueDate={dueDate}
    setDueDate={setDueDate}
    reminderTime={reminderTime}
    setReminderTime={setReminderTime}
    handleAddNotes={handleAddNote}
    editId={editId}
    darkMode={darkMode}
    user={user}
    handleExportPDF={() =>
      exportNotesPDF(savedNotes)
    }
  />

  <History
  history={history}
  showHistory={showHistory}
  setShowHistory={setShowHistory}
/>


            {/* BUTTONS */}

            <div className="d-flex gap-2 mb-4 flex-wrap mt-3">

              <button
                className={`btn ${activeSection === "notes"
                  ? "btn-primary"
                  : "btn-outline-primary"
                  }`}
                onClick={() =>
                  setActiveSection(
                    "notes"
                  )
                }
              >
                📝 Notes
              </button>

              <button
                className={`btn ${activeSection === "trash"
                  ? "btn-danger"
                  : "btn-outline-danger"
                  }`}
                onClick={() =>
                  setActiveSection(
                    "trash"
                  )
                }
              >
                🗑 Trash
              </button>

              <button
                className={`btn ${activeSection === "archive"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
                  }`}
                onClick={() =>
                  setActiveSection(
                    "archive"
                  )
                }
              >
                📥 Archive
              </button>

            </div>





            {/* NOTES */}

            {activeSection ===
              "notes" && (

                <div className="mt-4">

                  {orderedNotes.length === 0 ? (

                    <div className="text-center p-5">

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                        alt="No Notes"
                        width="200"
                        className="mb-4"
                      />

                      <h3>
                        No Notes Yet
                      </h3>

                      <p className="text-muted">
                        Start writing your ideas ✨
                      </p>

                    </div>

                  ) : (

                    <DragDropContext
                      onDragEnd={
                        handleDragEnd
                      }
                    >

                      <Droppable
                        droppableId="notes"
                      >

                        {(provided) => (

                          <div
                            ref={
                              provided.innerRef
                            }

                            {...provided.droppableProps}
                          >

                            {orderedNotes
                              .filter(
                                (note) => note
                              )
                              .map(
                                (
                                  note,
                                  index
                                ) => (

                                  <Draggable
                                    key={note.id.toString()}

                                    draggableId={note.id.toString()}

                                    index={index}
                                  >

                                    {(provided) => (

                                      <div
                                        ref={
                                          provided.innerRef
                                        }

                                        {...provided.draggableProps}

                                        {...provided.dragHandleProps}
                                      >

                                        <NoteCard
                                          note={note}
                                          index={index}
                                          handleEditNotes={handleEdit}
                                          handleDeleteNotes={deleteNote}
                                          handleFavorite={toggleFavorite}
                                          handlePinNote={togglePin}
                                          darkMode={darkMode}
                                          handleArchiveNote={archiveNote}
                                          handleShare={shareNote}
                                          handleHistory={handleHistory}
                                          user={user}
                                        />

                                      </div>

                                    )}

                                  </Draggable>

                                )
                              )}

                            {provided.placeholder}

                          </div>

                        )}

                      </Droppable>

                    </DragDropContext>

                  )}

                </div>

              )}

            {/* ARCHIVE */}

            {activeSection ===
              "archive" && (

                <div className="mt-5">

                  <h3 className="mb-4">
                    📥 Archived Notes
                  </h3>

                  {archiveNotes.length === 0 ? (

                    <p className="text-muted">
                      No Archived Notes
                    </p>

                  ) : (

                    archiveNotes.map(
                      (note) => (

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

                          <h5>
                            {note.title}
                          </h5>

                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                note.description,
                            }}
                          />

                          <div className="d-flex gap-2 mt-2">

                            <button
                              className="btn btn-success btn-sm"

                              onClick={() =>
                                restoreArchive(
                                  note.id
                                )
                              }
                            >
                              Restore
                            </button>

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

            {/* TRASH */}

            {activeSection ===
              "trash" && (

                <Trash
                  trashNotes={trashNotes}
                  handleRestoreNote={restoreNote}
                  handlePermanentDelete={permanentDelete}
                  darkMode={darkMode}
                />

              )}

          </div>
        </div>
      </>
      );

   

}