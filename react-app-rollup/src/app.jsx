import React, { useState } from 'react';

export default function App() {
	const [counter, setCounter] = useState(0);


	const increment = () => setCounter(counter + 1);

	return (
		<div>
			<h1>Rollup is amazing!</h1>
			<div>Count: {counter}</div>
			<button onClick={increment}>Increment</button>
		</div>
	);
}