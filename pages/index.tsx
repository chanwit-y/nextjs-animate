import type { InferGetStaticPropsType, NextPage } from "next";
import { DragDropContext } from "react-beautiful-dnd";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";
const Column = dynamic(() => import("../src/Column").then((m) => m.Column), {
  ssr: false,
});

export type Data = {
  id: number;
  name: string;
};

type Props = {
  initData: Data[];
};

const initData =  [
  {
    id: 1,
    name: "item-1",
  },
  {
    id: 2,
    name: "item-2",
  },
  {
    id: 3,
    name: "item-3",
  },
  {
    id: 4,
    name: "item-4",
  },
  {
    id: 5,
    name: "item-5",
  },
] 

// export async function getStaticProps() {
//   return {
//     props: {
//       initData: [
//         {
//           id: 1,
//           name: "item-1",
//         },
//         {
//           id: 2,
//           name: "item-2",
//         },
//         {
//           id: 3,
//           name: "item-3",
//         },
//         {
//           id: 4,
//           name: "item-4",
//         },
//         {
//           id: 5,
//           name: "item-5",
//         },
//       ],
//     }, // will be passed to the page component as props
//   };
// }

// const Home: NextPage<Props> = ({
//   initData,
// }: InferGetStaticPropsType<typeof getStaticProps>) => {
const Home: NextPage = () => {
  const [state, setState] = useState(initData);

  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const [placeholderProps, setPlaceholderProps] = useState({});

  const getDraggedDom = (draggableId: string) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  const reorderTasks = (tasks: any, startIndex: number, endIndex: number) => {
    const newTaskList = Array.from(tasks);
    const [removed] = newTaskList.splice(startIndex, 1);
    newTaskList.splice(endIndex, 0, removed);
    return newTaskList;
  };

  const onDragStart = (result: any) => {
    const { source, draggableId } = result;
    console.log(result)
    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = source.index;

    if (!draggedDOM.parentNode) return;

    /**
     * 1. Take all the items in the list as an array
     * 2. Slice from the start to the where we are dropping the dragged item (i.e destinationIndex)
     * 3. Reduce and fetch the styles of each item
     * 4. Add up the margins, widths, paddings
     * 5. Accumulate and assign that to clientY
     */
    const clientY =
      parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as any).paddingTop
      ) +
      [...(draggedDOM.parentNode.children as any)]
        .slice(0, sourceIndex)
        .reduce((total, current) => {
          const style =
            current.currentStyle || window.getComputedStyle(current);
          const marginBottom = parseFloat(style.marginBottom);

          return total + current.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // if the user drops outside of a droppable destination
    if (!destination) return;

    // If the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops in a different postion
    const tasks = state;
    const newTasks = reorderTasks(tasks, source.index, destination.index);

    const newState = {
      ...state,
      tasks: newTasks,
    };
    setState(newState);
  };

  const onDragUpdate = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM?.parentNode) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = destination.index;
    const sourceIndex = source.index;

    const childrenArray = draggedDOM.parentNode.children
      ? [...draggedDOM?.parentNode?.children as any]
      : [];

    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.splice(0, destinationIndex),
      movedItem,
      ...childrenArray.splice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode as any).paddingTop) +
      updatedArray.splice(0, destinationIndex).reduce((total, current) => {
        const style = current.currentStyle || window.getComputedStyle(current);
        const marginBottom = parseFloat(style.marginBottom);
        return total + current.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Animate App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ padding: 8, backgroundColor: "blue" }}>
          <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
      // onDragEnd={onDragEnd}
            onDragEnd={(result, provided) => {
              console.log(result.draggableId);
              console.log(provided);
            }}
          >
            <Column initData={state} />
          </DragDropContext>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
