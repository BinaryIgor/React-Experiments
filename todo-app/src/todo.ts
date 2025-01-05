
export type UUID = string;

export class Todo {
	constructor(readonly id: UUID, readonly name: string, readonly completed: boolean) { }

	copy({ id = this.id, name = this.name, completed = this.completed } = {}) {
		return new Todo(id, name, completed);
	}

	withCompleted(completed: boolean): Todo {
		return this.copy({ completed });
	}

	withCompletedNegated(): Todo {
		return this.withCompleted(!this.completed);
	}
}