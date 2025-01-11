export class CounterWebComponent extends HTMLElement {
	static observedAttributes = ["counter"];

	connectedCallback() {
		this._render();

		this.addEventListener("message", e => {
			console.log("Message!", e);
		});
	}

	_render() {
		const counter = this.getAttribute("counter");
		this.innerHTML = `<h1>WebComponentCounter: ${counter}</h1>`;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log("Count has changed!");
		if (name == "counter") {
			this._render();
		}
	}
}

customElements.define('counter-web-component', CounterWebComponent);