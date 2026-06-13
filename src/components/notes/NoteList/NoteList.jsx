import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import NoteCard from "../NoteCard/NoteCard";

const NoteList = ({
  activeSection,
  filteredNotes,
  handleDragEnd,
  handleEditNotes,
  handleDeleteNotes,
  handleFavorite,
  handlePinNote,
  darkMode,
  handleArchiveNote,
  handleShare,
  user,
}) => {
  if (activeSection !== "notes") return null;

  return (
    <div className="mt-4">

      {filteredNotes.length === 0 ? (

        <div className="text-center py-5">

          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt="No Notes"
            width="180"
            className="mb-3 opacity-75"
          />

          <h3 className={darkMode ? "text-light" : "text-dark"}>
            No Notes Yet
          </h3>

          <p className="text-secondary">
            Start writing your ideas ✨
          </p>

        </div>

      ) : (

        <DragDropContext onDragEnd={handleDragEnd}>

          <Droppable droppableId="notes">

            {(provided) => (

              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                {filteredNotes
                  .filter((note) => note && note.id)
                  .map((note, index) => (

                    <Draggable
                      key={note.id.toString()}
                      draggableId={note.id.toString()}
                      index={index}
                    >

                      {(provided) => (

                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            transition: "all 0.25s ease",
                          }}
                        >

                          <NoteCard
                            note={note}
                            index={index}
                            handleEditNotes={handleEditNotes}
                            handleDeleteNotes={handleDeleteNotes}
                            handleFavorite={handleFavorite}
                            handlePinNote={handlePinNote}
                            darkMode={darkMode}
                            handleArchiveNote={handleArchiveNote}
                            handleShare={handleShare}
                            user={user}
                          />

                        </div>

                      )}

                    </Draggable>

                  ))}

                {provided.placeholder}

              </div>

            )}

          </Droppable>

        </DragDropContext>

      )}

    </div>
  );
};

export default NoteList;