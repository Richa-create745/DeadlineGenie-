document.addEventListener("DOMContentLoaded", function () {



    // alert("wroking");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    const categoryInput = document.getElementById("categoryInput");

    const searchTask = document.getElementById("searchTask");
    const filterTask = document.getElementById("filterTask");

    const generatePlanBtn = document.getElementById("generatePlanBtn");
    const aiOutput = document.getElementById("aiOutput");

    function displayTask(taskObj, index) {

        const taskCard = document.createElement("div");


        taskCard.classList.add("task-card");

        if (taskObj.completed) {
            taskCard.classList.add("completed");
        }
        let color = "green";

        if (taskObj.priority === "High") {
            color = "red";
        } else if (taskObj.priority === "Medium") {
            color = "orange";
        }




        taskCard.innerHTML = `
  <h3 class="${taskObj.completed ? 'completed-task' : ''}">
    ${taskObj.task}
  </h3>
    <p>Deadline: ${taskObj.deadline}</p>
    <p>
Category: ${taskObj.category || "General"}
</p>
    <p style="color:${color};font-weight:bold;">
        Priority: ${taskObj.priority}
    </p>

   <button class="completeBtn">
    ${taskObj.completed ? "✅ Completed" : "Complete"}
   </button>

    <button class="deleteBtn">
        Delete
    </button>
`;



        const deleteBtn = taskCard.querySelector(".deleteBtn");

        deleteBtn.addEventListener("click", function () {

            tasks.splice(index, 1);

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderTasks();
        });

        const completeBtn = taskCard.querySelector(".completeBtn");

        completeBtn.addEventListener("click", function () {

            tasks[index].completed = !tasks[index].completed;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderTasks();
            updateDashboard();

        });
        taskList.appendChild(taskCard);
    }


//newfunc..
// function groupTasksByCategory(){

//     let grouped = {};

//     tasks.forEach(task=>{

//         let category = task.category || "General";


//         if(!grouped[category]){

//             grouped[category] = [];

//         }


//         grouped[category].push(task);

//     });


//     return grouped;

// }


//new function
function groupTasksByCategory(tasksArray){

    let grouped = {};


    tasksArray.forEach(task=>{

        let category = task.category || "General";


        if(!grouped[category]){

            grouped[category] = [];

        }


        grouped[category].push(task);

    });


    return grouped;

}




   function renderTasks() {

    // taskList.innerHTML = "<h2>Your Tasks</h2>";
    taskList.innerHTML = "";

const title = document.createElement("h2");
title.innerText = "Your Tasks";

taskList.appendChild(title);


    // 1. First filter tasks

    let filteredTasks = tasks.filter(task => {


        let searchValue =
            searchTask.value.toLowerCase();


        let matchesSearch =
            task.task.toLowerCase()
            .includes(searchValue);



        let filterValue =
            filterTask.value;


        let matchesFilter = true;


        if(filterValue === "Completed"){

            matchesFilter =
            task.completed === true;

        }

        else if(filterValue !== "All"){

            matchesFilter =
            task.priority === filterValue;

        }


        return matchesSearch && matchesFilter;


    });



    // 2. Then group filtered tasks

    let groupedTasks = groupTasksByCategory(filteredTasks);



    // 3. Display groups

    for(let category in groupedTasks){


        // taskList.innerHTML +=
        // `
        // <h2 class="category-title">
        // ${category}
        // </h2>
        // `;

        const heading = document.createElement("h2");

heading.classList.add("category-title");

heading.innerText = category;

taskList.appendChild(heading);


        groupedTasks[category].forEach(task=>{


            let index = tasks.indexOf(task);

            displayTask(task,index);


        });


    }

}





    searchTask.addEventListener(
        "input",
        renderTasks
    );


    filterTask.addEventListener(
        "change",
        renderTasks
    );


    addTaskBtn.addEventListener("click", function () {

        const task = document.getElementById("taskInput").value;
        const deadline = document.getElementById("deadlineInput").value;
        const priority = document.getElementById("priorityInput").value;

        const category = categoryInput.value;


        if (task.trim() === "") {
            alert("Please enter a task");
            return;
        }

        const taskData = {
            task,
            deadline,
            priority,
            category,
            completed: false
        };
        tasks.push(taskData);

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

        renderTasks();

        document.getElementById("taskInput").value = "";
        document.getElementById("deadlineInput").value = "";

        alert("Task Added Successfully!");
    });


    generatePlanBtn.addEventListener("click", function () {

        if (tasks.length === 0) {

            aiOutput.innerHTML =
                "<p>Add some tasks first.</p>";

            return;
        }


        let recommendation = `
    <h3>✨ Smart Productivity Plan</h3>
    `;


        // Copy tasks and sort by priority
       let sortedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {

        const priorityScore = {
            "High": 1,
            "Medium": 2,
            "Low": 3
        };

        return priorityScore[a.priority] - priorityScore[b.priority];

    });


      
             //here
             if(sortedTasks.length === 0){

              aiOutput.innerHTML = `
                   <h3>🎉 Congratulations!</h3>
                   <p>All your tasks are completed.</p>
                     `;

                         return;
            }
          
        


        sortedTasks.forEach((task, index) => {

            //here
          if(task.completed){
            return;
            }
            let message = "";


            // Priority based suggestions

            if (task.priority === "High") {

                message =
                    "🔥 Complete this first. It is your highest priority.";

            }

            else if (task.priority === "Medium") {

                message =
                    "⚡ Schedule time for this task.";

            }

            else {

                message =
                    "✅ Complete this after important tasks.";

            }



            // Deadline checking

            if (task.deadline) {

                let today = new Date();
                let deadlineDate = new Date(task.deadline);


                let difference =
                    Math.ceil(
                        (deadlineDate - today) /
                        (1000 * 60 * 60 * 24)
                    );


                if (difference < 0) {

                    message +=
                        " 🚨 This task is overdue.";

                }

                else if (difference <= 2) {

                    message +=
                        " ⏰ Deadline is very close.";

                }

                else {

                    message +=
                        ` 📅 ${difference} days remaining.`;

                }

            }



            recommendation += `

        <div class="ai-task-card">

        <b>${index + 1}. ${task.task}</b>

        <br>

        Priority: ${task.priority}

        <br>

        ${message}

        </div>

        <br>

        `;


        });



        recommendation += `

    <h4>💡 Productivity Tip</h4>

    <p>
    Focus on one important task at a time.
    Complete high priority tasks before moving to smaller tasks.
    </p>

    `;



        aiOutput.innerHTML = recommendation;


    });


    // Sidebar Navigation

    const dashboardBtn = document.getElementById("dashboardBtn");
    const tasksBtn = document.getElementById("tasksBtn");
    const goalsBtn = document.getElementById("goalsBtn");
    const habitsBtn = document.getElementById("habitsBtn");
    const settingsBtn = document.getElementById("settingsBtn");


    const sections = [
        document.getElementById("dashboardSection"),
        document.getElementById("taskList"),
        document.getElementById("goalsSection"),
        document.getElementById("habitsSection"),
        document.getElementById("settingsSection")
    ];


    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = "none";
        });
    }


    dashboardBtn.addEventListener("click", () => {

        hideAllSections();

        document.getElementById("dashboardSection").style.display = "block";

        updateDashboard();

    });

    tasksBtn.addEventListener("click", () => {
        hideAllSections();
        taskList.style.display = "block";
    });


    goalsBtn.addEventListener("click", () => {
        hideAllSections();
        document.getElementById("goalsSection").style.display = "block";
    });


    habitsBtn.addEventListener("click", () => {
        hideAllSections();
        document.getElementById("habitsSection").style.display = "block";
    });


    settingsBtn.addEventListener("click", () => {
        hideAllSections();
        document.getElementById("settingsSection").style.display = "block";
    });



    //habits n goals

    // Goals

    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    const addGoalBtn = document.getElementById("addGoalBtn");
    const goalInput = document.getElementById("goalInput");
    const goalList = document.getElementById("goalList");


    addGoalBtn.addEventListener("click", () => {

        if (goalInput.value.trim() == "")
            return;


        goals.push(goalInput.value);

        localStorage.setItem(
            "goals",
            JSON.stringify(goals)
        );


        renderGoals();

        goalInput.value = "";

    });


    function renderGoals(){

    goalList.innerHTML = "";

    goals.forEach((goal,index)=>{

        goalList.innerHTML += `

        <div class="goal-card">

            🎯 ${goal}

            <button class="deleteGoal" data-index="${index}">
                Delete
            </button>

        </div>

        `;

    });


    const deleteButtons =
    document.querySelectorAll(".deleteGoal");


    deleteButtons.forEach(button=>{

        button.addEventListener("click",()=>{

            let index = button.dataset.index;

            goals.splice(index,1);

            localStorage.setItem(
                "goals",
                JSON.stringify(goals)
            );

            renderGoals();
            updateDashboard();

        });

    });

}


    // Habits

    let habits = JSON.parse(localStorage.getItem("habits")) || [];


    const addHabitBtn = document.getElementById("addHabitBtn");
    const habitInput = document.getElementById("habitInput");
    const habitList = document.getElementById("habitList");


    addHabitBtn.addEventListener("click", () => {


        if (habitInput.value.trim() == "")
            return;


        habits.push(habitInput.value);


        localStorage.setItem(
            "habits",
            JSON.stringify(habits)
        );


        renderHabits();

        habitInput.value = "";


    });


   function renderHabits(){

    habitList.innerHTML = "";

    habits.forEach((habit,index)=>{

        habitList.innerHTML += `

        <div class="habit-card">

            🔥 ${habit}

            <button class="deleteHabit" data-index="${index}">
                Delete
            </button>

        </div>

        `;

    });


    const deleteButtons =
    document.querySelectorAll(".deleteHabit");


    deleteButtons.forEach(button=>{

        button.addEventListener("click",()=>{

            let index = button.dataset.index;

            habits.splice(index,1);

            localStorage.setItem(
                "habits",
                JSON.stringify(habits)
            );

            renderHabits();
            updateDashboard();

        });

    });

}
    function updateDashboard() {

        document.getElementById("totalTasks").innerText = tasks.length;


        let highCount = tasks.filter(task =>
            task.priority === "High"
        ).length;


        document.getElementById("highTasks").innerText = highCount;


        document.getElementById("totalGoals").innerText = goals.length;


        document.getElementById("totalHabits").innerText = habits.length;


        // Progress Bar

        let completedTasks = tasks.filter(
            task => task.completed === true
        ).length;


        let percentage = 0;


        if (tasks.length > 0) {

            percentage = Math.round(
                (completedTasks / tasks.length) * 100
            );

        }


        document.getElementById("progressFill").style.width =
            percentage + "%";


        document.getElementById("progressText").innerText =
            `${completedTasks}/${tasks.length} Tasks Completed (${percentage}%)`;


    }

    // for alerts
    function checkDeadlineAlerts() {

        let today = new Date();


        tasks.forEach(task => {

            if (task.deadline && !task.completed) {

                let deadlineDate = new Date(task.deadline);


                let difference = Math.ceil(
                    (deadlineDate - today) /
                    (1000 * 60 * 60 * 24)
                );


                if (difference <= 2 && difference >= 0) {

                    alert(
                        `⚠️ Deadline Alert!\n\nTask: ${task.task}\nOnly ${difference} day(s) left!`
                    );

                }


                else if (difference < 0) {

                    alert(
                        `🚨 Overdue Task!\n\n${task.task} deadline has passed.`
                    );

                }

            }

        });

    }

    renderGoals();
    renderHabits();
    renderTasks();
    updateDashboard();
    checkDeadlineAlerts();

});