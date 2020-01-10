import { TaskView } from '../view/TaskView';
import { Task } from '../data/Task';


export function sortDescriptionAscStrategy(taskViews) {
    taskViews.sort((firstTaskView, secondTaskView) => {
        let firstTaskDescription = firstTaskView.task.description;
        let secondTaskDescription = secondTaskView.task.description;

        if (firstTaskDescription > secondTaskDescription) {
            return 1;
        }
        if (firstTaskDescription < secondTaskDescription) {
            return -1;
        }

        return 0;
    });
}

export function sortDescriptionDescStrategy(taskViews) {
    sortDescriptionAscStrategy(taskViews)
    taskViews.reverse();
}

export function sortCreatedAscStrategy(taskViews) {
    taskViews.sort((firstTaskView, secondTaskView) => {
        let firstTaskCreated = firstTaskView.task.created;
        let secondTaskCreated = secondTaskView.task.created;

        if (firstTaskCreated > secondTaskCreated) {
            return 1;
        }
        if (firstTaskCreated < secondTaskCreated) {
            return -1;
        }

        return 0;
    });
}

export function sortCreatedDescStrategy(taskViews) {
    sortCreatedAscStrategy(taskViews);
    taskViews.reverse();
}

export function sortCompletedAscStrategy(taskViews) {
    taskViews.sort((firstTaskView, secondTaskView) => {
        let firstTaskCompleted = firstTaskView.task.completed;
        let secondTaskCompleted = secondTaskView.task.completed;

        if (firstTaskCompleted > secondTaskCompleted) {
            return 1;
        }
        if (firstTaskCompleted < secondTaskCompleted) {
            return -1;
        }

        return 0;
    });
}

export function sortCompletedDescStrategy(taskViews) {
    sortCompletedAscStrategy(taskViews);
    taskViews.reverse();
}
