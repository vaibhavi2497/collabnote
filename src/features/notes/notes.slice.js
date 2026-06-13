import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allNotes: [],
  savedNotes: [],
  trashNotes: [],
  archiveNotes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: "notes",

  initialState,

  reducers: {

    setAllNotes: (state, action) => {
      state.allNotes = action.payload;
    },

    setSavedNotes: (state, action) => {
      state.savedNotes = action.payload;
    },

    setTrashNotes: (state, action) => {
      state.trashNotes = action.payload;
    },

    setArchiveNotes: (state, action) => {
      state.archiveNotes = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

  },

});

export const {
  setAllNotes,
  setSavedNotes,
  setTrashNotes,
  setArchiveNotes,
  setLoading,
  setError,
} = noteSlice.actions;

export default noteSlice.reducer;