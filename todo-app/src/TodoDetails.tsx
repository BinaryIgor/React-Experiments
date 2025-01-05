import { useParams, Link } from "react-router";
import { Todo, UUID } from "./todo";
import { fetchTodos } from "./Todos";
import { useEffect, useState } from "react";

export default function TodoDetails() {
	const { id } = useParams<{ id: string }>();

	const {loading, todo } = fetchTodo(id!);

	const headerClass = "text-xl font-bold mb-4";

	if (loading) {
		return (<div><h2 className={`${headerClass}`}>Loading TODO...</h2></div>);
	}

	if (!todo) {
		return (
			<div>
				<h2 className={`${headerClass}`}>Todo Not Found</h2>
				<Link to="/" className="text-blue-500 hover:underline">
					Back to TODOs
				</Link>
			</div>
		)
	}

	return (
		<div>
			<h2 className={`${headerClass}`}>Todo Details</h2>
			<p className="mb-2">
				<strong>ID:</strong> {todo.id}
			</p>
			<p className="mb-2">
				<strong>Text:</strong> {todo.name}
			</p>
			<p className="mb-4">
				<strong>Status:</strong> {todo.completed ? "Completed" : "Pending"}
			</p>
			<Link to="/" className="text-blue-500 hover:underline">
				Back to List
			</Link>
		</div>
	);
}

const fetchTodo = (id: UUID) => {
	const [todo, setTodo] = useState<Todo>();
	const { loading, todos } = fetchTodos();

	useEffect(() => {
		console.log("Todo(s), loading: " + loading);
		if (!loading) {
			console.log("Todos: ", todos);
			const todo = todos.find(t => t.id == id);
			setTodo(todo);
		}
	}, [loading]);

	return { loading, todo };
};