const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const allBtn = document.getElementById('allBtn');
const completedBtn = document.getElementById('completedBtn');
const pendingBtn = document.getElementById('pendingBtn');
const sortBtn = document.getElementById('sortBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filteredTasks = [...tasks];

function renderTasks() {
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task-item');
        if (task.completed) taskElement.classList.add('completed');
        
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button onclick="toggleTaskCompletion(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        filteredTasks.push(newTask); 
        saveTasks();
        renderTasks();
    }
    taskInput.value = '';
}

function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    filteredTasks = filterTasks(currentFilter); 
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    filteredTasks = filteredTasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

let currentFilter = 'all';

function filterTasks(status) {
    currentFilter = status; 
    if (status === 'completed') {
        return tasks.filter(task => task.completed);
    }
    if (status === 'pending') {
        return tasks.filter(task => !task.completed);
    }
    return tasks;
}

function sortTasks() {
    tasks.sort((a, b) => b.id - a.id);
    filteredTasks.sort((a, b) => b.id - a.id);
    saveTasks();
    renderTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
allBtn.addEventListener('click', () => {
    filteredTasks = filterTasks('all');
    renderTasks();
});
completedBtn.addEventListener('click', () => {
    filteredTasks = filterTasks('completed');
    renderTasks();
});
pendingBtn.addEventListener('click', () => {
    filteredTasks = filterTasks('pending');
    renderTasks();
});
sortBtn.addEventListener('click', sortTasks);

// Initial render
renderTasks();
