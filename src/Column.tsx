import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Data } from "../pages";

type Props = {
  initData: Data[];
};

export const Column = ({ initData }: Props) => {
  return (
    <Droppable droppableId="droppable">
      {(provided ) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {initData.map !== undefined ?  initData.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item.id.toString()}
              index={index}
            >
              {(draggableProvided, snapshot) => (
                <div
                  style={{
                //     display: "flex",
                    width: 80,
                    backgroundColor: snapshot.isDragging ? "pink" : "red",
                    padding: 4,
                    margin: 2,
                  }}
		{...draggableProvided.dragHandleProps}
		{...draggableProvided.draggableProps}
		ref={draggableProvided.innerRef}
                >
                  {item.name}
                </div>
              )}
            </Draggable>
          )) : null}
        </div>
      )}
    </Droppable>
  );
};
