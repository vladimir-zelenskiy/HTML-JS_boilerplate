export class Task {
	description;
	state;
	created;
	completed;
}


export class TaskState {
	static STATE_OPEN = 'Open';
	static STATE_DONE = 'Done';
}