"use strict"

let tasks = [];
let listOfTasks = document.getElementById("tasks-list");

const toggleCard = (id) => {

    tasks.forEach((task) => {

        if(task.id == id){
            task.isFinished = !task.isFinished;
            if(task.isFinished){
                let date = new Date();
                document.getElementById(id).style = "border-left-color: lightgrey; filter: brightness(96%);";
                document.getElementById(id).firstElementChild.style = "text-decoration: line-through;";
                let child = document.createElement('div');
                let dateString = date.toLocaleTimeString().slice(0, 5) + " "+ date.toLocaleDateString();
                child.innerHTML = dateString;
                child.classList.add("card-footer", "text-center", "p-0");
                document.getElementById(id).appendChild(child);
                task.date = dateString;
            }
            else{
                document.getElementById(id).style = "border-left-color: lightskyblue; filter: none";
                document.getElementById(id).firstElementChild.style = "text-decoration: none;";
                document.getElementById(id).removeChild(document.getElementById(id).lastElementChild);
            }
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

        if( task.isFinished == true){
            listOfTasks.innerHTML += 
            `<div id="${task.id}" class="card mb-3 finish-card d-flex shadow-sm" onclick="toggleCard(id)">
                <div class="card-body d-flex justify-content-between mr-2"> 
                    <div style="text-decoration: line-through;">
                        ${task.name}
                    </div>
                    <div >
                        <i class="fa-solid fa-x text-danger align-self-center delete-icon" onclick="deleteTask(${task.id})"></i>
                    </div>
                </div>
                <div class="card-footer text-center p-0">${task.date}</div>
            </div>`;
                
        }
        else{
            listOfTasks.innerHTML += 
                `<div id="${task.id}" class="card mb-3 waiting-card d-flex shadow-sm" onclick="toggleCard(id)">
                    <div class="card-body d-flex justify-content-between mr-2"> 
                        <div style="text-decoration: none;">
                            ${task.name}
                        </div>
                        <div >
                            <i class="fa-solid fa-x text-danger align-self-center delete-icon" onclick="deleteTask(${task.id})"></i>
                        </div>
                    </div>
                </div>`;
        }
    }
}


const addTask = () => {
    // Find html element
    let taskName = document.getElementById('task-input').value;

    if(taskName != ""){
        // Add new task to the array
        let taskId = 0;
        if(tasks.length != 0){
            taskId = tasks[tasks.length - 1].id + 1; 
        } 
        tasks.push({id: taskId, name: taskName, isFinished: false, date: null});
        // Store in localStorage - assign extended array to the "tasks" key 
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Display tasks
        loadTasks();

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