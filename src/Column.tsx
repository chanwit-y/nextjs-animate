import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Data } from "../pages";

type Props = {
  initData: Data[];
};

export const Column = ({ initData }: Props) => {
  return (
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {initData.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item.id.toString()}
              index={index}
            >
              {(draggableProvided, snapshot) => (
                <div
                  {...draggableProvided.dragHandleProps}
                  {...draggableProvided.draggableProps}
                  ref={draggableProvided.innerRef}
                  style={{
                    display: "flex",
                    width: 80,
                    backgroundColor: "red",
                    padding: 4,
                    margin: 2,
                  }}
                >
                  {item.name}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </Droppable>
  );
};
