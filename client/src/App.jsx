import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const test = 4;
  useEffect(() => {
    let isMounted = true;
    const fetchTodos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (isMounted) setTodos(data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTodos();
    return () => {
      isMounted = false;
    };
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await res.json();
      setTodos((prev) => [data, ...prev]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      setTodos((prev) => prev.map((todo) => (todo._id === id ? data : todo)));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="container">
      <h1>Todo App !!</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="empty">No todos yet. Add one above!!!!!</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <span
                  className="todo-text"
                  onClick={() => toggleTodo(todo._id)}
                >
                  {todo.text}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
