import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { Todo, UUID } from './todo';
import TodoDetails from './TodoDetails';

const initialTodos = [] as Todo[];
for (let i = 0; i < 10; i++) {
  initialTodos.push(new Todo(crypto.randomUUID(), `TODO ${i}`, false));
}

export default function Todos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, todos, setTodos } = fetchTodos();

  useEffect(() => {
    console.log("Location has changed!", Date.now(), location);
  }, [location]);

  const [newTodo, setNewTodo] = useState("");
  const [newTodoError, setNewTodoError] = useState("");

  const addTodo = () => {
    if (newTodo == "") {
      setNewTodoError("Task cannot be empty");
      return;
    }
    setNewTodoError("");
    setNewTodo("");

    setTodos([...todos, new Todo(crypto.randomUUID(), newTodo, false)]);
  };

  const toggleTodo = (id: UUID) => {
    setTodos(todos.map(todo => todo.id === id ? todo.withCompletedNegated() : todo));
  };

  const deleteTodo = (id: UUID) => {
    setTodos(todos.filter(todo => todo.id != id));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center p-4'>
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md'>
        <h1 className='text-xl font-bold mb-4'>Todo App</h1>
        <Routes>
          <Route path="/" element={<>
            {newTodoError && <p className="text-red-500 italic">{newTodoError}</p>}
            <div className='flex items-center space-x-2 mb-4'>
              <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)}
                className='flex-grow border border-gray-300 rounded px-3 py-2' placeholder='Add a new task...' />
              <button onClick={addTodo} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Add</button>
            </div>
            {loading && <p className='text-lg my-8 italic'>Loading...</p>}
            <ul className='mt-8 space-y-2'>
              {todos.map(todo => (
                <li key={todo.id} className={`flex justify-between items-center p-2 border rounded ${todo.completed ? "bg-gray-200" : ""}`}>
                  {/* <Link to={`/todos/${todo.id}`} className="flex-grow cursor-pointer">{todo.name}</Link> */}
                  <span className="flex-grow cursor-pointer" onClick={() => navigate(`/todos/${todo.id}`)}>{todo.name} {`${Date.now()}`}</span>
                  <button onClick={() => toggleTodo(todo.id)} className="text-green-500 hover:text-green-600 p-2">
                    Toggle
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className='text-red-500 hover:text-red-600 p-2'>Delete</button>
                </li>))}
            </ul>
          </>} />
          <Route path="/todos/:id" element={<TodoDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export const fetchTodos = () => {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTodos([...initialTodos]);
      setLoading(false);
    }, 1000);
  }, []);

  return { loading, todos, setTodos };
};