import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../features/notes/notes.slice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});