import { TodoList } from "../data/TodoList";


export function storeTodoList(todoListView) {
    localStorage.setItem('todoList', JSON.stringify(todoListView.todoList));
    localStorage.setItem('sortingType', JSON.stringify(todoListView.sortingType))
}

function restoreTodoList() {
    let storedData = localStorage.getItem('todoList');
    let restoredTodoList = JSON.parse(storedData, (key, value) => {
        if (key === 'created' || key === 'completed') {
            return new Date(value);
        }
        return value;
    });
    return restoredTodoList ? restoredTodoList : new TodoList();
}

function restoreSortingType() {
    let sortingType = localStorage.getItem('sortingType');
    let restoredSortingType = JSON.parse(sortingType);
    return restoredSortingType ? restoredSortingType : { open: 'descriptionAsc', done: 'descriptionAsc' };
}

export function restoreTodoListView(todoListView) {
    let todoList = restoreTodoList();
    let sortingType = restoreSortingType();
    todoListView.taskViews = [];
    todoListView.todoList = todoList;
    todoListView.sortingType = sortingType;

    return todoListView;
}