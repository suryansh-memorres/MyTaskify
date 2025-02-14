document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("new-record-button").addEventListener("click", function () {
        document.getElementById("task-form-container").classList.remove("hidden");
        document.getElementById("task-form").reset();
        document.getElementById("task-form").dataset.index = "";
    });

    document.getElementById("close-form").addEventListener("click", function () {
        document.getElementById("task-form-container").classList.add("hidden");
        document.getElementById("task-form").reset();
    });
    displayTasks();
});

function generateUUID() {
    return crypto.randomUUID();
}

function savingTheRecord() {
    let title = document.getElementById("task-name").value;
    let description = document.getElementById("task-desc").value;
    let priorityLevel = document.getElementById("task-priority").value;
    let taskCompleteCheck = document.getElementById("task-status").checked;


    if(!title) {
        alert("The task needs a title.");
        return;
    } else if(!priorityLevel) {
        alert("Please set a priority for the task.");
        return;
    }
    
    let id= generateUUID();
    let record = {id, title, description, priorityLevel, taskCompleteCheck};
    let tasks = JSON.parse(localStorage.getItem("items")) || [];
    
    tasks.push(record);
    
    localStorage.setItem("items", JSON.stringify(tasks));
    
    alert("Task has been created");
    
    document.getElementById("task-form-container").reset();
    
    displayTasks();
}

document.getElementById("task-form").addEventListener("submit", function(saveTask){
    saveTask.preventDefault();

    let title = document.getElementById("task-name").value;
    let description = document.getElementById("task-desc").value;
    let priorityLevel = document.getElementById("task-priority").value;
    let taskCompleteCheck = document.getElementById("task-status").checked;

    if(!title) {
        alert ("The task needs a title.");
        return;
    } else if (!priorityLevel) {
        alert("Please add a Priority level to the task.")
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("items")) || [];
    let index = parseInt(document.getElementById("task-form").dataset.index);

    if (!isNaN(index) && index >= 0) {
        tasks[index] = {id: tasks[index].id, title, description, priorityLevel, taskCompleteCheck};
    } else {
        let id = crypto.randomUUID();
        tasks.push({id, title, description, priorityLevel, taskCompleteCheck});
    }

    localStorage.setItem("items", JSON.stringify(tasks));

    // savingTheRecord();
    document.getElementById("task-form-container").classList.add("hidden");

    // Clear the form fields
    document.getElementById("task-form").reset();
    displayTasks();

})

//document.getElementById("close-form").addEventListener();

let savedData = localStorage.getItem("items");
let items = savedData ? JSON.parse(savedData) : [];

document.getElementById("delete-button").addEventListener("click", function (event) {
    event.preventDefault();
    
    let index = document.getElementById("task-form").dataset.index;

    if (index === undefined || index === "" || isNaN(index)) {
        alert("No task selected for deletion.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("items")) || [];

    tasks.splice(index, 1); // Remove the task at the specified index

    localStorage.setItem("items", JSON.stringify(tasks)); // Save the updated list

    // Hide and reset the form
    document.getElementById("task-form-container").classList.add("hidden");
    document.getElementById("task-form").reset();
    
    // **Reset the dataset index to prevent saving issues**
    //document.getElementById("task-form").dataset.index = "";

    displayTasks(); // Refresh the task list
});


function displayTasks() {
    let ongoingTaskList = document.getElementById("ongoingTaskList");
    let completedTaskList = document.getElementById("completedTaskList");

    ongoingTaskList.innerHTML = ""; // Clears the ongoing task list
    completedTaskList.innerHTML = ""; // Clears the completed task list

    let tasks = JSON.parse(localStorage.getItem("items")) || []; // Retrieve tasks from localStorage

    tasks.forEach((task, index) => {
        let li = document.createElement("li"); // Create list item
        li.textContent = `${task.title}: ${task.description} - Priority: ${task.priorityLevel}`; // Display task info
        li.dataset.index = index; // Store task index
        li.classList.add("clickable-task"); // Add CSS class

        if (task.taskCompleteCheck === true) {  
            // If task is completed, add it to Completed Tasks section
            completedTaskList.appendChild(li);
        } else {  
            // Otherwise, add it to Ongoing Tasks section
            ongoingTaskList.appendChild(li);
        }

        // Allow clicking to edit the task
        li.addEventListener("click", function () {
            openTaskForm(task, index);
        });
    });
}

function openTaskForm(task, index) {
    document.getElementById("task-name").value = task.title; // Set task title in input
    document.getElementById("task-desc").value = task.description; // Set description
    document.getElementById("task-priority").value = task.priorityLevel;
    document.getElementById("task-status").checked = task.taskCompleteCheck;

    // Store task index for updating later
    document.getElementById("task-form").dataset.index = index;

    // Show the form
    document.getElementById("task-form-container").classList.remove("hidden");
}