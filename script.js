"use strict"

let tasks = [];
let listOfTasks = document.getElementById("tasks-list");

class Task{
    constructor(id, name, isFinished, steps, finishedSteps, date){
        this.id = id;
        this.name = name;
        this.isFinished = isFinished;
        this.steps = steps;
        this.finishedSteps = finishedSteps;
        this.date = date;
    }
}

const toggleCard = (id) => {

    tasks.forEach((task) => {

        if(task.id == id){
            // Toggle state
            task.isFinished = !task.isFinished;

            if(task.isFinished){
                // Prepare date
                let date = new Date();
                let dateString = date.toLocaleTimeString().slice(0, 5) + " " + date.toLocaleDateString();
                // Update
                task.date = dateString;
            }
            else{
                task.date = null;
            }
            // Change state of the card
            document.getElementById(id).outerHTML = getCardHTML(task);
            // Update the task in localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    })
}

const loadTasks = () =>{
    // Check the localStorage has data
    if(localStorage.getItem('tasks') != null){
        // Fill array with tasks
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    listOfTasks.innerHTML = "";
    if(tasks == null) return;

    for (let task of tasks ){
        // Render every card
        listOfTasks.innerHTML += getCardHTML(task);
    }
}

const getCardHTML = (task) => {

    return (
        `<div id="${task.id}" class="card ${task.isFinished? "finish-card" : "waiting-card"} d-flex justify-content-center shadow-sm mb-3">

            <div class="card-body d-flex justify-content-between m-2"> 
                <div>
                    ${task.name}
                </div>
                <div class="buttons-wrapper">
                    ${
                        task.isFinished?
                        `<i class="fa-solid fa-rotate-right text-secondary mx-1 bg-ripple" onclick="onRestartTask(${task.id})"></i>`
                        : ``
                    }
                    <i class="fa-solid fa-x align-self-center text-danger delete-icon mx-1 bg-ripple" onclick="deleteTask(${task.id})"></i>
                </div>
            </div>

            <div class="progress-bar d-flex justify-content-center align-items-center gap-1 flex-row">
                ${(() => {
                    let stepsHTML = "";
                    for(let i = 0 ; i < task.steps ; i++){
                        if(task.finishedSteps < i + 1){
                            // Empty step
                            stepsHTML += `<div style="opacity: 0.4" class="step"></div>`
                        }
                        else{
                            // Filled step
                            stepsHTML += `<div class="step"></div>`
                        }
                    }
                    return stepsHTML;
                })()}
                <i class="fa-solid fa-angle-down text-secondary px-1 ${task.isFinished? "" : "bg-ripple"}" onclick="onStepDown(${task.id})"></i>
                <i class="fa-solid fa-angle-up text-success px-1 ${task.isFinished? "" : "bg-ripple"}" onclick="onStepUp(${task.id})"></i>
            </div>

            ${task.isFinished? 
                `<div class="card-footer border-0 finish-message text-center success-color p-0">
                    <i class="fa-solid fa-check"></i>
                    <span>Ukończone (${task.date})</span>
                </div>` : ``}

        </div>`
    )
}

const onStepUp = (taskId) => {

    
    for(let task of tasks){
        if(task.id === taskId){

            // When total full
            if(task.finishedSteps ===  task.steps) return;
            // Increase 
            if(task.finishedSteps < task.steps){

                task.finishedSteps += 1;
                if(task.finishedSteps ===  task.steps){
                    toggleCard(task.id);
                }
            }

        }
        // Rerender card
        document.getElementById(task.id).outerHTML = getCardHTML(task);
    }
    updateTasksInStorage();
}

const onStepDown = (taskId) => {
    for(let task of tasks){

        // When total empty or full (if full - task finished)
        if((task.finishedSteps === 0) || (task.finishedSteps === task.steps)) return;
        // Decrement
        if(task.id === taskId){
            
            if(task.finishedSteps > 0){
                task.finishedSteps -= 1;
            }
        }
        // Rerender card
        document.getElementById(task.id).outerHTML = getCardHTML(task);
    }
    updateTasksInStorage();
}

const onRestartTask = (taskId) => {
    for(let task of tasks){

        if(task.id === taskId){
            
            // Restart task
            task.finishedSteps = 0;
            task.date = null;
            task.isFinished = false;
        }
        // Rerender card
        document.getElementById(task.id).outerHTML = getCardHTML(task);
    }
    updateTasksInStorage();
}

const addTask = () => {
    // Find html element
    let taskName = document.getElementById('task-input').value;

    if(taskName != ""){
        // Add new task to the array
        let taskId;
        if(tasks.length != 0){
            taskId = tasks[tasks.length - 1].id + 1; 
        }
        else{
            taskId = 0;
        }

        // Add task
        tasks.push(new Task(taskId, taskName, false, 4, 0, null));
        // Store in localStorage - assign extended array to the "tasks" key 
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Display tasks
        loadTasks();
        //Erase input
        document.getElementById('task-input').value = "";

    }
}

const deleteTask = (id) =>{
    tasks = tasks.filter((task) =>{
        if(task.id == id){
            return false;
        }
        else{
            return true;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

const updateTasksInStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const clearTasks = () => {
    tasks = [];
    localStorage.clear();
    loadTasks();
}


// Add task using enter key
const checkEnter = (event) =>{
    if(event.keyCode === 13){
        addTask();
    }
}