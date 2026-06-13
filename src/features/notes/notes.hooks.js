import { useEffect, useState } from "react";

import {

  subscribeToNotes,

  addNewNote,

  updateExistingNote,

  softDeleteNote,

  restoreDeletedNote,

  permanentlyDeleteNote,

  toggleFavoriteNote,

  togglePinnedNote,

  archiveSingleNote,

  restoreArchivedNote,

  shareSingleNote,

   updateNoteOrder,

  setEditingUserService,

} from "./notes.service";

// =========================
// NOTES HOOK
// =========================

export const useNotes = (userEmail) => {

  // =========================
  // STATES
  // =========================

  const [savedNotes, setSavedNotes] =
    useState([]);

  const [trashNotes, setTrashNotes] =
    useState([]);

  const [archiveNotes, setArchiveNotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // REALTIME NOTES
  // =========================

  useEffect(() => {

    if (!userEmail) return;

    setLoading(true);

    const unsubscribe =
      subscribeToNotes(

        userEmail,

        (notes) => {

          // ACTIVE NOTES

          const active =
            notes.filter(
              (note) =>
                !note.deleted &&
                !note.archived
            );

          // TRASH NOTES

          const trash =
            notes.filter(
              (note) =>
                note.deleted
            );

          // ARCHIVE NOTES

          const archive =
            notes.filter(
              (note) =>
                note.archived
            );

          // SET STATES

          setSavedNotes(active);

          setTrashNotes(trash);

          setArchiveNotes(archive);

          setLoading(false);

        }

      );

    // CLEANUP

    return () => unsubscribe();

  }, [userEmail]);

  // =========================
  // ADD NOTE
  // =========================

  const addNote = async (
    noteData
  ) => {

    await addNewNote(
      noteData
    );

  };

  // =========================
  // UPDATE NOTE
  // =========================

 const updateNote = ({
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
  return updateExistingNote({
    id,
    title,
    description,
    category,
    color,
    dueDate,
    reminderTime,
    userName,
    previousNote,
  });
};
  // =========================
  // DELETE NOTE
  // =========================

  const deleteNote = async (
    id
  ) => {

    await softDeleteNote(id);

  };

  // =========================
  // RESTORE NOTE
  // =========================

  const restoreNote = async (
    id
  ) => {

    await restoreDeletedNote(
      id
    );

  };

  // =========================
  // PERMANENT DELETE
  // =========================

  const permanentDelete =
    async (id) => {

      await permanentlyDeleteNote(
        id
      );

    };

  // =========================
  // FAVORITE
  // =========================

  const toggleFavorite =
    async (id, current) => {

      await toggleFavoriteNote(
        id,
        current
      );

    };

  // =========================
  // PIN NOTE
  // =========================

  const togglePin =
    async (id, current) => {

      await togglePinnedNote(
        id,
        current
      );

    };

  // =========================
  // ARCHIVE NOTE
  // =========================

  const archiveNote =
    async (id) => {

      await archiveSingleNote(
        id
      );

    };

  // =========================
  // RESTORE ARCHIVE
  // =========================

  const restoreArchive =
    async (id) => {

      await restoreArchivedNote(
        id
      );

    };

  // =========================
  // SHARE NOTE
  // =========================

  const shareNote =
    async (id, email) => {

      await shareSingleNote(
        id,
        email
      );

    };

  // =========================
  // EDITING USER
  // =========================

  const setEditingUser =
    async (
      id,
      userName
    ) => {

      await setEditingUserService(
        id,
        userName
      );

    };

  // =========================
  // RETURN
  // =========================

  return {

    savedNotes,

    trashNotes,

    archiveNotes,

    loading,

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
    
     updateNoteOrder,

    setEditingUser,

  };

};