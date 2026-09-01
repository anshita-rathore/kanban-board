import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/axios.js";
import CardModal from "../components/cardModel.jsx";
import "./board.css";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const loadBoard = () => api.get(`/boards/${id}`).then(({ data }) => setBoard(data));

  useEffect(() => { loadBoard(); }, [id]);

  if (!board) return <p>Loading board...</p>;

  const addList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await api.post("/lists", { title: newListTitle, board: id });
    setNewListTitle("");
    setAddingList(false);
    loadBoard();
  };

  const deleteList = async (listId) => {
    await api.delete(`/lists/${listId}`, { data: { board: id } });
    loadBoard();
  };

  const addCard = async (listId, title) => {
    if (!title.trim()) return;
    await api.post("/cards", { title, list: listId, board: id });
    loadBoard();
  };

  const deleteCard = async (cardId) => {
    await api.delete(`/cards/${cardId}`, { data: { board: id } });
    setActiveCard(null);
    loadBoard();
  };

  const updateCard = async (cardId, updates) => {
    await api.put(`/cards/${cardId}`, { ...updates, board: id });
    loadBoard();
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceList = board.lists.find((l) => l._id === source.droppableId);
    const destList = board.lists.find((l) => l._id === destination.droppableId);
    const sourceCards = Array.from(sourceList.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    let destCards;
    if (sourceList._id === destList._id) {
      sourceCards.splice(destination.index, 0, movedCard);
      destCards = sourceCards;
    } else {
      destCards = Array.from(destList.cards);
      destCards.splice(destination.index, 0, movedCard);
    }

    const newLists = board.lists.map((l) => {
      if (l._id === sourceList._id && l._id === destList._id) return { ...l, cards: destCards };
      if (l._id === sourceList._id) return { ...l, cards: sourceCards };
      if (l._id === destList._id) return { ...l, cards: destCards };
      return l;
    });
    setBoard({ ...board, lists: newLists });

    const updates = destCards.map((c, idx) => ({ id: c._id, list: destList._id, position: idx }));
    if (sourceList._id !== destList._id) {
      sourceCards.forEach((c, idx) => updates.push({ id: c._id, list: sourceList._id, position: idx }));
    }
    await api.put("/cards/reorder/bulk", { board: id, updates });
  };

  return (
    <div className="board-screen">
      <Link to="/">← Boards</Link>
      <h1>{board.title}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-lists">
          {board.lists.map((list) => (
            <div className="list-col" key={list._id}>
              <div className="list-head">
                <p>{list.title}</p>
                <button onClick={() => deleteList(list._id)}>×</button>
              </div>

              <Droppable droppableId={list._id} type="CARD">
                {(provided) => (
                  <div className="list-cards" ref={provided.innerRef} {...provided.droppableProps}>
                    {list.cards.map((card, index) => (
                      <Draggable draggableId={card._id} index={index} key={card._id}>
                        {(provided) => (
                          <div
                            className="kanban-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setActiveCard(card)}
                          >
                            <p>{card.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <AddCardForm onAdd={(title) => addCard(list._id, title)} />
            </div>
          ))}

          <AddListForm
            adding={addingList}
            setAdding={setAddingList}
            value={newListTitle}
            setValue={setNewListTitle}
            onSubmit={addList}
          />
        </div>
      </DragDropContext>

      {activeCard && (
        <CardModal
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onSave={(updates) => updateCard(activeCard._id, updates)}
          onDelete={() => deleteCard(activeCard._id)}
        />
      )}
    </div>
  );
}

function AddCardForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const submit = (e) => { e.preventDefault(); onAdd(title); setTitle(""); };

  return open ? (
    <form onSubmit={submit}>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => !title && setOpen(false)} />
      <button type="submit">Add card</button>
    </form>
  ) : (
    <button className="add-card-btn" onClick={() => setOpen(true)}>+ Add a card</button>
  );
}

function AddListForm({ adding, setAdding, value, setValue, onSubmit }) {
  return adding ? (
    <div className="add-list-col">
      <form onSubmit={onSubmit}>
        <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Add list</button>
      </form>
    </div>
  ) : (
    <div className="add-list-col">
      <button className="add-list-btn" onClick={() => setAdding(true)}>+ Add another list</button>
    </div>
  );
}