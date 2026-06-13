import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const filterNotes = (notes = [], search = "") => {

  if (!search) {
    return notes;
  }

  return notes.filter((note) => {

    const title = note.title || "";
    const content = note.description || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase())
    );

  });

};

// =========================
// SORT PINNED NOTES
// =========================
export const sortPinnedNotes = (notes = []) => {

  return [...notes].sort((a, b) => {

    if (a.pinned === b.pinned) {
      return (
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
      );
    }

    return a.pinned ? -1 : 1;

  });

};

// =========================
// EXPORT NOTES
// =========================
export const exportNotesPDF = (
  notes
) => {

  const doc = new jsPDF();

  // TITLE

  doc.setFontSize(20);

  doc.text(
    "CollabNotes Report",
    14,
    20
  );

  // TABLE

  autoTable(doc, {

    startY: 30,

    head: [[
      "Title",
      "Category",
      "Pinned",
      "Favorite",
      "Due Date"
    ]],

    body: notes.map(
      (note) => [

        note.title || "",

        note.category || "",

        note.pinned
          ? "Yes"
          : "No",

        note.favorite
          ? "Yes"
          : "No",

        note.dueDate ||
        "No Date",

      ]
    ),

    styles: {

      fontSize: 10,
   

    },

    headStyles: {

      fillColor: [13, 110, 253],

    },

  });

  // SAVE PDF

  doc.save(
    "CollabNotes.pdf"
  );

};