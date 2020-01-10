import './style.css';
import './res/img/remove.png';
import './res/img/search.png';
import { TodoList } from './todolist/data/TodoList';
import { TodoListService } from './todolist/service/TodoListService';
import { TodoListView } from './todolist/view/TodoListView';
import { TodoListViewService } from './todolist/view/service/TodoListViewService';
import { TaskViewFactory, CreateTaskData, TaskData } from './todolist/view/service/TaskViewFactory';
import { storeTodoList, restoreTodoListView } from './todolist/service/storingService';


let todoList = new TodoList();
const todoListView = new TodoListView();
todoListView.todoList = todoList;
const todoListService = new TodoListService();
const todoListViewService = new TodoListViewService(todoListService);
const taskViewFactory = new TaskViewFactory(todoListViewService);
todoListViewService.taskViewFactory = taskViewFactory;

const newTaskDescription = document.getElementById('newTaskDescription');


const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', () => {
	let taskDescription = newTaskDescription.value;
	newTaskDescription.value = '';
	let newTask = todoListService.createOpenTask(taskDescription);
	todoListService.addTask(newTask, todoList);

	// let newTaskView = todoListViewService.createTaskView(newTask);
	let createTaskData = new CreateTaskData();
	createTaskData.task = newTask;
	createTaskData.todoListView = todoListView;

	let taskView = taskViewFactory.createView(createTaskData);

	let taskData = new TaskData();
	taskData.taskView = taskView;
	taskData.todoListView = todoListView;
  todoListViewService.addTaskView(taskData);
  todoListViewService.sortOpenTasks(todoListView);

	storeTodoList(todoListView);
});

const clearOpenList = document.getElementById('clearOpenList');
clearOpenList.addEventListener('click', () => todoListViewService.clearOpenList(todoListView));

const clearDoneList = document.getElementById('clearDoneList');
clearDoneList.addEventListener('click', () => todoListViewService.clearDoneList(todoListView));

const searchTaskInput = document.getElementById('searchTaskInput');
searchTaskInput.addEventListener('input', () => todoListViewService.filterTodoList(todoListView, searchTaskInput.value));

// const openTasksSorting = document.getElementById('openTasksSorting');
// openTasksSorting.addEventListener('change', event => todoListViewService.sortOpenTasks(todoListView));

// const doneTasksSorting = document.getElementById('doneTasksSorting');
// doneTasksSorting.addEventListener('change', () => todoListViewService.sortDoneTasks(todoListView));

const openTasksSortingDiv = document.getElementById('openTasksSortingDiv');
const openTasksSortingItemsDiv = document.getElementById('openTasksSortingItemsDiv');
openTasksSortingItemsDiv.addEventListener('click', event => {
	let optionDiv = event.target;
  updateSelectDiv(optionDiv, openTasksSortingDiv);

	event.stopPropagation();
	openTasksSortingItemsDiv.classList.toggle('select-sorting-hide');

	let elementId = event.target.id;
	let sortingType = elementId.substring(elementId.indexOf('_') + 1);
	todoListViewService.setTasksSortingType(todoListView, sortingType, 'open');
	todoListViewService.sortOpenTasks(todoListView);
});

openTasksSortingDiv.addEventListener('click', event => {
	event.stopPropagation();
	openTasksSortingItemsDiv.classList.toggle('select-sorting-hide');
});


const doneTasksSortingDiv = document.getElementById('doneTasksSortingDiv');
const doneTasksSortingItemsDiv = document.getElementById('doneTasksSortingItemsDiv');

doneTasksSortingItemsDiv.addEventListener('click', event => {
	let optionDiv = event.target;
  updateSelectDiv(optionDiv, doneTasksSortingDiv);

	event.stopPropagation();
	doneTasksSortingItemsDiv.classList.toggle('select-sorting-hide');

	let elementId = event.target.id;
	let sortingType = elementId.substring(elementId.indexOf('_') + 1);
	todoListViewService.setTasksSortingType(todoListView, sortingType, 'done');
	todoListViewService.sortDoneTasks(todoListView);
});

doneTasksSortingDiv.addEventListener('click', event => {
	event.stopPropagation();
	doneTasksSortingItemsDiv.classList.toggle('select-sorting-hide');
});

document.addEventListener('DOMContentLoaded', () => {
  restoreTodoListView(todoListView);
  todoListViewService.restoreView(todoListView);
  todoList = todoListView.todoList;

  todoListViewService.sortOpenTasks(todoListView);
  todoListViewService.sortDoneTasks(todoListView);

  let currentOpenOption = document.getElementById('openTasksSorting_' + todoListView.sortingType.open);
  let currentDoneOption = document.getElementById('doneTasksSorting_' + todoListView.sortingType.done);

  updateSelectDiv(currentOpenOption, openTasksSortingDiv);
  updateSelectDiv(currentDoneOption, doneTasksSortingDiv);

	console.log(todoListView);
});

function updateSelectDiv(option, div) {
  let currentOptionText = document.createTextNode(option.innerHTML);
	let documentFragment = new DocumentFragment();
  documentFragment.appendChild(currentOptionText);
  
  div.innerHTML = '';
	div.appendChild(documentFragment);
};

