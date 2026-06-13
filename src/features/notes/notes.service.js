import { collection,  doc, deleteDoc, addDoc, updateDoc, serverTimestamp, arrayUnion, onSnapshot} from "firebase/firestore";

import { db } from "../../services/firebase";

// =========================
// GET NOTES
// =========================

export const subscribeToNotes = (
  userEmail,
  callback
) => {
  return onSnapshot(
    collection(db, "notes"),
    (snapshot) => {
      const notes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // SORT BY ORDER
      notes.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

      const visibleNotes = notes.filter(
        (note) =>
          note.userEmail === userEmail ||
          note.collaborators?.includes(userEmail)
      );

      callback(visibleNotes);
    }
  );
};

// =========================
// ADD NOTE
// =========================

export const addNewNote = async ({
  user,
  title,
  description,
  category,
  color,
  dueDate,
  reminderTime,
}) => {

  await addDoc(
    collection(db, "notes"),
    {

      title,

      description,

      category,

      color,

      dueDate,

      reminderTime,

      userEmail: user.email,

      userId: user.uid,

      createdAt: serverTimestamp(),

      pinned: false,

      favorite: false,

      archived: false,

      deleted: false,

      sharedWith: [],

       order: Date.now(),

    }
  );

};

// =========================
// UPDATE NOTE
// =========================

export const updateExistingNote = async ({
 id,
  title,
  description,
  category,
  color,
  dueDate,
  reminderTime,
  userName,
  previousNote,
}) => {
  console.log("UPDATE NOTE DATA", {
  userName,
  previousNote,
});

  if (
    previousNote &&
    previousNote.title !== title
  ) {
    await addHistory({
      noteId: id,
      field: "title",
      oldValue: previousNote.title,
      newValue: title,
      userName,
      
    });
    console.log("History Added");
  }

  if (
    previousNote &&
    previousNote.description !== description
  ) {
    await addHistory({
      noteId: id,
      field: "description",
      oldValue: previousNote.description,
      newValue: description,
      userName,
    });
    
  }
  console.log({
  title,
  description,
  category,
  color,
  dueDate,
  reminderTime,
});

  await updateDoc(
    doc(db, "notes", id),
    {
      title,
      description,
      category,
      color,
      dueDate,
      reminderTime,
      editingBy: "",
      updatedAt: serverTimestamp(),
    }
  );
};
  // =======================
  //  UPDATE ORDERNOTE
  // =======================
export const updateNoteOrder = async (
  noteId,
  order
) => {
  await updateDoc(
    doc(db, "notes", noteId),
    {
      order,
    }
  );
};

// =========================
// SOFT DELETE
// =========================

export const softDeleteNote =
  async (id) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        deleted: true,
      }
    );

  };

// =========================
// RESTORE NOTE
// =========================

export const restoreDeletedNote =
  async (id) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        deleted: false,
      }
    );

  };

// =========================
// PERMANENT DELETE
// =========================

export const permanentlyDeleteNote =
  async (id) => {

    await deleteDoc(
      doc(db, "notes", id)
    );

  };

// =========================
// FAVORITE
// =========================

export const toggleFavoriteNote =
  async (
    id,
    current
  ) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        favorite: !current,
      }
    );

  };

// =========================
// PIN NOTE
// =========================

export const togglePinnedNote =
  async (
    id,
    current
  ) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        pinned: !current,
      }
    );

  };

// =========================
// ARCHIVE NOTE
// =========================

export const archiveSingleNote =
  async (id) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        archived: true,
      }
    );

  };

// =========================
// RESTORE ARCHIVE
// =========================

export const restoreArchivedNote =
  async (id) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        archived: false,
      }
    );

  };

/// =========================
// SHARE NOTE
// =========================
export const shareSingleNote = async (
  noteId,
  email
) => {

  if (!email?.trim()) {

    throw new Error(
      "Please enter email"
    );

  }

  await updateDoc(
    doc(db, "notes", noteId),
    {
      collaborators: arrayUnion(
        email.trim()
      ),
    }
  );

};
// =========================
// EDITING USER
// =========================

export const setEditingUserService =
  async (
    id,
    userName
  ) => {

    await updateDoc(
      doc(db, "notes", id),

      {
        editingBy:
          userName,
      }
    );

  };

  // =========================
// HISTORY
// =========================
  
  export const addHistory = async ({
  noteId,
  field,
  oldValue,
  newValue,
  userName,
}) => {
  try {
    await addDoc(
      collection(
        db,
        "notes",
        noteId,
        "history"
      ),
      {
        field,
        oldValue,
        newValue,
        updatedBy: userName,
        timestamp: serverTimestamp(),
      }
    );
  } catch (error) {
    console.log(error);
  }
};

  