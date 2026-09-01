import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/boards").then(({ data }) => {
      setBoards(data);
      setLoading(false);
    });
  }, []);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const { data } = await api.post("/boards", { title: newTitle });
    setBoards([data, ...boards]);
    setNewTitle("");
    setCreating(false);
  };

  const deleteBoard = async (id) => {
    await api.delete(`/boards/${id}`);
    setBoards(boards.filter((b) => b._id !== id));
  };

  return (
    <div>
      <header>
        <span>Welcome, {user?.name}</span>
        <button onClick={logout}>Log out</button>
      </header>

      <h1>Your boards</h1>
      <button className="dash-new-btn" onClick={() => setCreating(!creating)}>+ New board</button>

      {creating && (
        <form onSubmit={createBoard}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Board title" />
          <button type="submit">Create</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid-container">
          {boards.map((board) => (
              <div key={board._id} className="board" onClick={() => navigate(`/board/${board._id}`)}>
                <h3>{board.title}</h3>
                <button onClick={(e) => { e.stopPropagation(); deleteBoard(board._id); }}>Delete</button>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}