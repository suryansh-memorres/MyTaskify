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

let timer = false;  
let hour = 0, minute = 0, second = 0, count = 0;
let timerEnable = 0; 

let startTime = document.getElementById("start-time");
let stopTime = document.getElementById("stop-time");
let resetTime = document.getElementById("reset-time");

startTime.addEventListener("click", function() {
    timer = true;
    timerEnable = 1;
    stopWatch();
});

stopTime.addEventListener("click", function() {
    timer = false;
    timerEnable = 0;
});

resetTime.addEventListener("click", function() {
    resetTimer();
});

function stopWatch() {
    if (timer) {
        count++;
        if (count === 100) {
            second++;
            count = 0;

            if (second === 60) {
                minute++;
                second = 0;

                if (minute === 60) {
                    hour++;
                    minute = 0;
                }
            }
        }
        updateTimeDisplay();

        let tasks = JSON.parse(localStorage.getItem("items")) || [];
        let index = document.getElementById("task-form").dataset.index;
        if (index !== undefined && index !== "") {
            let task = tasks[index];
            task.hour = hour;
            task.minute = minute;
            task.second = second;
            task.count = count;
            task.timerEnable = timerEnable;
            task.lastSaveTime = Date.now(); // Save last timestamp

            localStorage.setItem("items", JSON.stringify(tasks));
        }
        setTimeout(stopWatch, 10);
    }
}

function updateTimeDisplay() {
    document.getElementById('hr').innerHTML = hour.toString().padStart(2, "0");
    document.getElementById('min').innerHTML = minute.toString().padStart(2, "0");
    document.getElementById('sec').innerHTML = second.toString().padStart(2, "0");
    document.getElementById('count').innerHTML = count.toString().padStart(2, "0");
}

function resetTimer() {
    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    timerEnable = 0;
    updateTimeDisplay();
}

function generateUUID() {
    return crypto.randomUUID();
}

function savingTheRecord() {
    let title = document.getElementById("task-name").value;
    let description = document.getElementById("task-desc").value;
    let priorityLevel = document.getElementById("task-priority").value;
    let taskCompleteCheck = document.getElementById("task-status").checked;

    if (!title) {
        alert("The task needs a title.");
        return;
    } else if (!priorityLevel) {
        alert("Please set a priority for the task.");
        return;
    }

    let id = generateUUID();
    let record = { id, title, description, priorityLevel, taskCompleteCheck, hour, minute, second, count, timerEnable, lastSaveTime: Date.now() };
    let tasks = JSON.parse(localStorage.getItem("items")) || [];

    tasks.push(record);
    localStorage.setItem("items", JSON.stringify(tasks));

    alert("Task has been created");
    document.getElementById("task-form").reset();
    resetTimer();
    displayTasks();
}

document.getElementById("task-form").addEventListener("submit", function (saveTask) {
    saveTask.preventDefault();

    let title = document.getElementById("task-name").value;
    let description = document.getElementById("task-desc").value;
    let priorityLevel = document.getElementById("task-priority").value;
    let taskCompleteCheck = document.getElementById("task-status").checked;

    if (!title) {
        alert("The task needs a title.");
        return;
    } else if (!priorityLevel) {
        alert("Please add a Priority level to the task.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("items")) || [];
    let index = parseInt(document.getElementById("task-form").dataset.index);

    if (!isNaN(index) && index >= 0) {
        tasks[index] = { ...tasks[index], title, description, priorityLevel, taskCompleteCheck, hour, minute, second, count, timerEnable, lastSaveTime: Date.now() };
    } else {
        let id = generateUUID();
        tasks.push({ id, title, description, priorityLevel, taskCompleteCheck, hour, minute, second, count, timerEnable, lastSaveTime: Date.now() });
    }

    localStorage.setItem("items", JSON.stringify(tasks));
    document.getElementById("task-form-container").classList.add("hidden");
    document.getElementById("task-form").reset();
    resetTimer();
    displayTasks();
});

document.getElementById("delete-button").addEventListener("click", function (event) {
    event.preventDefault();

    let index = document.getElementById("task-form").dataset.index;

    if (index === undefined || index === "" || isNaN(index)) {
        alert("No task selected for deletion.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("items")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(tasks));

    document.getElementById("task-form-container").classList.add("hidden");
    document.getElementById("task-form").reset();
    resetTimer();
    displayTasks();
});

function displayTasks() {
    let ongoingTaskList = document.getElementById("ongoingTaskList");
    let completedTaskList = document.getElementById("completedTaskList");

    ongoingTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("items")) || [];

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent = `${task.title}: ${task.description} - Priority: ${task.priorityLevel}`;
        li.dataset.index = index;
        li.classList.add("clickable-task");

        if (task.taskCompleteCheck) {
            completedTaskList.appendChild(li);
        } else {
            ongoingTaskList.appendChild(li);
        }

        li.addEventListener("click", function () {
            openTaskForm(task, index);
        });
    });
}

function openTaskForm(task, index) {
    document.getElementById("task-name").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-priority").value = task.priorityLevel;
    document.getElementById("task-status").checked = task.taskCompleteCheck;

    let previousTime = (task.hour * 3600000) + (task.minute * 60000) + (task.second * 1000) + (task.count * 10);
    let currentTime = Date.now();

    if (task.timerEnable === 1) {
        let elapsedTime = currentTime - task.lastSaveTime;
        let totalMilliseconds = previousTime + elapsedTime;

        hour = Math.floor(totalMilliseconds / 3600000);
        minute = Math.floor((totalMilliseconds % 3600000) / 60000);
        second = Math.floor((totalMilliseconds % 60000) / 1000);
        count = Math.floor((totalMilliseconds % 1000) / 10);
    } else {
        hour = task.hour || 0;
        minute = task.minute || 0;
        second = task.second || 0;
        count = task.count || 0;
    }

    timerEnable = task.timerEnable || 0;
    updateTimeDisplay();
    document.getElementById("task-form").dataset.index = index;
    document.getElementById("task-form-container").classList.remove("hidden");

    if (timerEnable === 1) {
        timer = true;
        stopWatch();
    }
}
