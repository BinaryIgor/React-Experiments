import { useState } from 'react';
import { Link } from 'react-router';

export default function App() {
	const [counter, setCounter] = useState(0);
	return (
		<div>
			<div>{counter}</div>
			<button onClick={() => setCounter(counter + 1)}>Increase</button>
			<Link style={{ padding: "8px", display: "block"}} to="/details">Go to The Details</Link>
		</div>);
}