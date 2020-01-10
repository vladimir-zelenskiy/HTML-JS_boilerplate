import { TaskView } from '../TaskView';
import { ViewConstants } from '../ViewConstants';
import { TaskState } from '../../data/Task';

export class CreateTaskData {
    task;
    todoListView;
}

export class TaskData {
    task;
    todoList;
    taskView;
}

export class TaskViewFactory {

    todoListViewService;

    constructor(todoListViewService) {
        this.todoListViewService = todoListViewService;
    }

    createView(createTaskData) {
        let task = createTaskData.task;
        let todoList = createTaskData.todoListView.todoList;

        let taskView = new TaskView();
        taskView.task = task;

        let taskData = new TaskData();
        taskData.task = task;
        taskData.todoList = todoList;
        taskData.taskView = taskView;
        taskData.todoListView = createTaskData.todoListView;

        let taskStateElement = this.createStateElement(taskData);

        let taskDescriptionElement = this.createTaskDescriptionElement(taskData);
        let taskDescriptionEditor = this.createTaskDescriptionEditor(taskData);
        let taskDescriptionDiv = this.createTaskDescriptionDiv();
        taskDescriptionDiv.appendChild(taskDescriptionElement);
        taskDescriptionDiv.appendChild(taskDescriptionEditor);

        let removeButtonDiv = this.createRemoveButtonDiv();
        let removeButton = this.createRemoveButton(taskData);
        let taskElement = this.createTaskElement(taskData);
        let taskDatesElement = this.createTaskDatesElement(taskData);

        taskElement.appendChild(taskStateElement);
        taskElement.appendChild(taskDescriptionDiv);
        taskElement.appendChild(taskDatesElement);
        removeButtonDiv.appendChild(removeButton);
        taskElement.appendChild(removeButtonDiv);

        taskView.element = taskElement;
        taskView.stateElement = taskStateElement;
        taskView.taskDescriptionElement = taskDescriptionElement;
        taskView.taskDescriptionEditor = taskDescriptionEditor;
        taskView.taskDatesElement = taskDatesElement;
        taskView.removeElement = removeButton;
        taskView.taskDiv = taskElement;

        return taskView;
    }

    createStateElement(taskData) {
        let task = taskData.task;
        let taskStateElement = document.createElement('span');

        taskStateElement.id = 'taskState_' + task.number;
        taskStateElement.classList.add('task-state-checkbox');
        if (task.state === TaskState.STATE_DONE) {
            taskStateElement.classList.add('task-checked');
        }
        taskStateElement.addEventListener('click', () => this.todoListViewService.handleChangeTaskState(taskData));

        return taskStateElement;
    }

    createTaskDescriptionElement(taskData) {
        let taskDescriptionElement = document.createElement('span');
        let taskDescriptionTextElement = this.createTaskDescriptionTextElement(taskData);
        taskDescriptionElement.appendChild(taskDescriptionTextElement);

        taskDescriptionElement.addEventListener('dblclick', () => this.todoListViewService.editTaskDescription(taskData));

        return taskDescriptionElement;
    }

    createTaskDescriptionTextElement(taskData) {
        let task = taskData.task;
        return document.createTextNode(task.description);
    }

    createTaskDescriptionEditor(taskData) {
        let taskDescriptionEditor = document.createElement('input');
        taskDescriptionEditor.type = 'text';
        taskDescriptionEditor.classList.add('hidden');
        taskDescriptionEditor.classList.add('bottom-border');

        taskDescriptionEditor.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                this.todoListViewService.confirmEditingTaskDescription(taskData);
            } else if (event.key === 'Escape') {
                this.todoListViewService.cancelEditingTaskDescription(taskData);
            }
        });

        taskDescriptionEditor.addEventListener('focusout', () => this.todoListViewService.cancelEditingTaskDescription(taskData));

        return taskDescriptionEditor;
    }

    createTaskDescriptionDiv() {
        let taskDescriptionDiv = document.createElement('div');
        taskDescriptionDiv.classList.add('task-description');

        return taskDescriptionDiv;
    }

    createRemoveButtonDiv() {
        let removeButtonDiv = document.createElement('div');
        removeButtonDiv.classList.add('left-border');
        removeButtonDiv.classList.add(ViewConstants.HIDDEN);

        return removeButtonDiv;
    }

    createRemoveButton(taskData) {
        let removeTaskButton = document.createElement('input');
        removeTaskButton.id = 'removeTaskButton_' + taskData.task.number;
        removeTaskButton.type = 'image';
        removeTaskButton.src = 'res/img/remove.png';
        removeTaskButton.classList.add('remove-task');
        removeTaskButton.addEventListener('click', () => this.todoListViewService.removeTask(taskData));

        return removeTaskButton;
    }

    createTaskElement(taskData) {
        let taskElement = document.createElement('div');
        taskElement.classList.add('task-data');
        taskElement.classList.add('shadow');
        taskElement.addEventListener('mouseenter',  () => this.todoListViewService.handleTaskViewMouseEnter(taskData));
        taskElement.addEventListener('mouseleave',  () => this.todoListViewService.handleTaskViewMouseLeave(taskData));

        return taskElement;
    }

    createDateElement(date) {
        let dateElement = document.createElement('div');
        let formattedDate = (date)
                        ? date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                        : '';
        
        let dateText = document.createTextNode(formattedDate);
        dateElement.appendChild(dateText);

        return dateElement;
    }

    createDateCreatedElement(taskData) {
        let date = taskData.task.created;
        let createdDateElement = this.createDateElement(date);
        createdDateElement.classList.add('created');
        createdDateElement.classList.add('date-font');

        return createdDateElement;
    }

    createDateCompletedElement(taskData) {
        let date = taskData.task.completed;
        let createdDateElement = this.createDateElement(date);
        createdDateElement.classList.add('completed');
        createdDateElement.classList.add('date-font');

        return createdDateElement;
    }

    createTaskDatesElement(taskData) {
        let datesElement = document.createElement('div');
        let createdDateElement = this.createDateCreatedElement(taskData);
        let completedDateElement = this.createDateCompletedElement(taskData);
        datesElement.appendChild(createdDateElement);
        datesElement.appendChild(completedDateElement);
        datesElement.classList.add('offset-horizontally');

        return datesElement;
    }
}