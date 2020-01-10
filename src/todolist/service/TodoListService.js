import { TodoList } from '../data/TodoList';
import { Task, TaskState } from '../data/Task';

export class TodoListService {

	getTasksCount(todoList) {
		return todoList.tasks.length;
	}

	getTaskByNumber(todoList, number) {
		return todoList.tasks.find(task => task.number === number);
	}

	createOpenTask(description) {
		let task = new Task();
		task.description = description;
		task.state = TaskState.STATE_OPEN;
		task.created = new Date();

		return task;
	}

	addTask(task, todoList) {
		todoList.tasks.push(task);
		task.number = this.getTasksCount(todoList);

		console.log(todoList);
	}

	getOpenTasks(todoList) {
		return todoList.tasks.filter(task => task.state === TaskState.STATE_OPEN);
	}

	getDoneTasks(todoList) {
		return todoList.tasks.filter(task => task.state === TaskState.STATE_DONE);
	}

	clearOpenList(todoList) {
		let openTasks = this.getOpenTasks(todoList);
		this.removeTasksFromTodoList(openTasks, todoList);
	}

	clearDoneList(todoList) {
		let doneTasks = this.getDoneTasks(todoList);
		this.removeTasksFromTodoList(doneTasks, todoList);
	}

	removeTasksFromTodoList(tasksToRemove, todoList) {
		let tasks = todoList.tasks;
		tasksToRemove.forEach(taskToRemove => tasks.splice(tasks.indexOf(taskToRemove), 1));
	}

	removeTask(task, todoList) {
		let tasks =  todoList.tasks;
		tasks.splice(tasks.indexOf(task), 1);
	}

	searchTask(name) {
		console.log("search task executes...");
	}

	completeTask(task) {
		task.state = TaskState.STATE_DONE;
	}

	reopenTask(task) {
		task.state = TaskState.STATE_OPEN;
	}

	changeTaskState(task) {
		if (task.state === TaskState.STATE_OPEN) {
			task.state = TaskState.STATE_DONE;
			task.completed = new Date();
		} else {
			task.state = TaskState.STATE_OPEN;
			task.created = new Date();
			task.completed = null;
		}
	}

}
