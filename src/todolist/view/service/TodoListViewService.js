import { TaskState } from '../../data/Task';
import { sortDescriptionAscStrategy,
    sortDescriptionDescStrategy,
    sortCreatedAscStrategy,
    sortCreatedDescStrategy,
    sortCompletedAscStrategy,
    sortCompletedDescStrategy } from '../../service/sortingStrategies'
import { ViewConstants } from '../../view/ViewConstants.js';
import { CreateTaskData, TaskData } from './TaskViewFactory';
import { storeTodoList } from '../../service/storingService';

class SortingData {
    todoListView;
    taskViews;
    sort;
}

export class TodoListViewService {

    openTasksListContainer = document.getElementById('openTasksListContainer');
    doneTasksListContainer = document.getElementById('doneTasksListContainer');

    todoListService;
    taskViewFactory;
    todoListViewRenderer;

    sortingStrategies = new Map();

    constructor(todoListService, todoListViewRenderer, taskViewFactory) {
        this.todoListService = todoListService;
        this.todoListViewRenderer = todoListViewRenderer;
        this.taskViewFactory = taskViewFactory;

        this.sortingStrategies.set('descriptionAsc', sortDescriptionAscStrategy);
        this.sortingStrategies.set('descriptionDesc', sortDescriptionDescStrategy);
        
        this.sortingStrategies.set('createdAsc', sortCreatedAscStrategy);
        this.sortingStrategies.set('createdDesc', sortCreatedDescStrategy);

        
        this.sortingStrategies.set('completedAsc', sortCompletedAscStrategy);
        this.sortingStrategies.set('completedDesc', sortCompletedDescStrategy);
    }

    addTaskView(taskData) {
        let taskView = taskData.taskView;
        let todoListView = taskData.todoListView;

        todoListView.taskViews.push(taskView);
        let state = taskView.task.state;
        let documentFragment = new DocumentFragment();
        documentFragment.appendChild(taskView.taskDiv);

        let container = (state === TaskState.STATE_OPEN)
                        ? this.openTasksListContainer
                        : this.doneTasksListContainer;
        
        container.appendChild(documentFragment);
    }

    handleChangeTaskState(taskData) {
        let taskView = taskData.taskView;

        this.todoListService.changeTaskState(taskView.task);
        this.changeTaskStateView(taskView);

        this.removeTaskView(taskView);
        this.addTaskView(taskData);

        storeTodoList(taskData.todoListView);
    }

    changeTaskStateView(taskView) {
        let taskStateElement = taskView.stateElement;
        taskStateElement.classList.toggle(ViewConstants.CHECKED);

        let taskData = new TaskData();
        taskData.taskView = taskView;
        taskData.task = taskView.task;

        let createdDateElement = this.taskViewFactory.createDateCreatedElement(taskData);
        let completedDateElement = this.taskViewFactory.createDateCompletedElement(taskData);

        taskView.taskDatesElement.innerHTML = '';

        let documentFragment = new DocumentFragment();
        documentFragment.appendChild(createdDateElement);
        documentFragment.appendChild(completedDateElement);

        taskView.taskDatesElement.appendChild(documentFragment);
    }

    handleTaskViewMouseEnter(taskViewData) {
        let taskView = taskViewData.taskView;
        let taskRemoveButton = taskView.removeElement;
        let removeButtonDiv = taskRemoveButton.parentNode;
        removeButtonDiv.classList.remove(ViewConstants.HIDDEN);
    }

    handleTaskViewMouseLeave(taskViewData) {
        let taskView = taskViewData.taskView;
        let taskRemoveButton = taskView.removeElement;
        let removeButtonDiv = taskRemoveButton.parentNode;
        removeButtonDiv.classList.add(ViewConstants.HIDDEN);
    }

    removeTask(removeTaskData) {
        let removeTask = removeTaskData.task;
        let taskView = removeTaskData.taskView;
        let todoListView = removeTaskData.todoListView;
        let taskViews = todoListView.taskViews;
        let todoList = todoListView.todoList;

        this.todoListService.removeTask(removeTask, todoList);
        this.removeTaskView(taskView);
        taskViews.splice(taskViews.indexOf(taskView), 1);

        console.log(todoList);
        console.log(todoListView);

        storeTodoList(todoListView);
    }

    removeTaskView(taskView) {
        let removeTaskDiv = taskView.taskDiv;
        let listDiv = removeTaskDiv.parentNode;
        listDiv.removeChild(removeTaskDiv);
    }

    clearOpenList(todoListView) {
        let todoList = todoListView.todoList;
        this.todoListService.clearOpenList(todoList);
        this.clearTaskDivs(openTasksListContainer);
        this.clearTaskViews(todoListView);
        
        console.log(todoList);
        console.log(todoListView);
        
        storeTodoList(todoListView);
    }

    clearDoneList(todoListView) {
        let todoList = todoListView.todoList;
        this.todoListService.clearDoneList(todoList);
        this.clearTaskDivs(doneTasksListContainer);
        this.clearTaskViews(todoListView);

        console.log(todoList);
        console.log(todoListView);
        
        storeTodoList(todoListView);
    }

    clearTaskDivs(tasksContainer) {
        while(tasksContainer.firstChild) {
            tasksContainer.removeChild(tasksContainer.firstChild);
        }
    }

    clearTaskViews(todoListView) {
        let taskViews = todoListView.taskViews;
        let tasks = todoListView.todoList.tasks;
        todoListView.taskViews = taskViews.filter(taskView => tasks.includes(taskView.task));
    }

    filterTodoList(todoListView, searchValue) {
        let todoList = todoListView.todoList;
        let tasks = todoList.tasks;
        let searchedTasks = tasks.filter(task => task.description.indexOf(searchValue) > -1);

        this.filterTaskList(todoListView.taskViews, searchedTasks);
    }

    filterTaskList(taskViews, searchedTasks) {
        let taskViewsToHide = taskViews.filter(taskView => !searchedTasks.includes(taskView.task));
        let taskViewsToShow = taskViews.filter(taskView => searchedTasks.includes(taskView.task));

        taskViewsToHide.forEach(openTaskView => openTaskView.element.classList.add(ViewConstants.HIDDEN));
        taskViewsToShow.forEach(openTaskView => openTaskView.element.classList.remove(ViewConstants.HIDDEN))
    }

    editTaskDescription(taskData) {
        let task = taskData.task;
        let taskView = taskData.taskView;
        let taskDescription = task.description;
        let taskDescriptionEditor = taskView.taskDescriptionEditor;
        let taskDescriptionElement = taskView.taskDescriptionElement;

        taskDescriptionEditor.value = taskDescription;
        taskDescriptionEditor.classList.remove(ViewConstants.HIDDEN);
        taskDescriptionElement.classList.add(ViewConstants.HIDDEN);
    }

    confirmEditingTaskDescription(taskData) {
        let taskView = taskData.taskView;
        let task = taskData.task;
        let taskDescriptionEditor = taskView.taskDescriptionEditor;
        let taskDescriptionElement = taskView.taskDescriptionElement;

        task.description = taskDescriptionEditor.value;

        let taskDescriptionTextElement = this.taskViewFactory.createTaskDescriptionTextElement(taskData);
        taskDescriptionElement.innerHTML = '';
        taskDescriptionElement.appendChild(taskDescriptionTextElement);

        taskDescriptionEditor.classList.add(ViewConstants.HIDDEN);
        taskView.taskDescriptionElement.classList.remove(ViewConstants.HIDDEN);

        storeTodoList(taskData.todoListView);
    }

    cancelEditingTaskDescription(taskData) {
        let taskView = taskData.taskView;
        let taskDescriptionEditor = taskView.taskDescriptionEditor;
        taskDescriptionEditor.classList.add(ViewConstants.HIDDEN);
        taskView.taskDescriptionElement.classList.remove(ViewConstants.HIDDEN);
    }

    sortTasksList(taskListView, sortType = 'nameAsc') {
        let sortingStrategy = this.sortingStrategies.get(sortType);
        
        let taskViews = taskListView.taskViews;
        sortingStrategy(taskViews);



        this.todoListViewRenderer.updateTaskListView(taskListView);
    }

    setTasksSortingType(todoListView, sortingType, taskType) {
        todoListView.sortingType[taskType] = sortingType;
    }

    sortOpenTasks(todoListView) {
        let sortingType = todoListView.sortingType.open;
        let todoList = todoListView.todoList;
        let openTasks = this.todoListService.getOpenTasks(todoList);

        let sortingData = new SortingData();
        sortingData.todoListView = todoListView;
        sortingData.tasks = openTasks;
        sortingData.sortingType = sortingType;
        sortingData.container = this.openTasksListContainer;

        this.executeSortingOfElements(sortingData);
        storeTodoList(todoListView);
    }

    sortDoneTasks(todoListView) {
        let sortingType = todoListView.sortingType.done;
        let todoList = todoListView.todoList;
        let doneTasks = this.todoListService.getDoneTasks(todoList);

        let sortingData = new SortingData();
        sortingData.todoListView = todoListView;
        sortingData.tasks = doneTasks;
        sortingData.sortingType = sortingType;
        sortingData.container = this.doneTasksListContainer;

        this.executeSortingOfElements(sortingData);
        storeTodoList(todoListView);
    }

    executeSortingOfElements(sortingData) {
        let tasks = sortingData.tasks;
        let taskViews = sortingData.todoListView.taskViews;
        let sortingType = sortingData.sortingType;
        let taskViewsForSorting = taskViews.filter(taskView => tasks.includes(taskView.task));
        
        let sort = this.sortingStrategies.get(sortingType);
        sort(taskViewsForSorting);

        let container = sortingData.container;
        this.clearTaskDivs(container);

        let documentFragment = new DocumentFragment();
        taskViewsForSorting.forEach(taskView => documentFragment.appendChild(taskView.taskDiv));
        container.appendChild(documentFragment);
    }

    restoreView(todoListView) {
        todoListView.taskViews = [];
        let restoredTasks = todoListView.todoList.tasks;
        let restoredTaskViews = restoredTasks.map(restoredTask => {
            let createTaskData = new CreateTaskData();
            createTaskData.task = restoredTask;
            createTaskData.todoListView = todoListView;
    
            let taskView = this.taskViewFactory.createView(createTaskData);
            return taskView;
        });

        restoredTaskViews.forEach(restoredTaskView => {
            let taskData = new TaskData();
	        taskData.taskView = restoredTaskView;
	        taskData.todoListView = todoListView;
            this.addTaskView(taskData);
        });
    }
}