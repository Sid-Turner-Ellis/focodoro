// const { findById } = require("../../models/taskSchema");

console.log("Clock is connected");

//event listeners for controlling the clock
document.querySelector('.stop').addEventListener('click', changeState)
document.querySelector('.start').addEventListener('click', changeState)

//global variables
let clock = document.getElementsByClassName('clock')[0]
const timeLimitPomo = 1500
const timeLimitBreak = 300
const timeLimitLongBreak = 1800
let timeLimit;
let totaltime = 0
let state = false
//out of 8
let sessionNumber = 1;
//this will be doubled each time a long break is reached
let longBreakMultiplier = 8;

//the clock 
function startStopTime() {
    clock.textContent = convertSec(timeLimit)
    if (convertSec(timeLimit) == '00:00') {
        if (sessionNumber % 2 != 0) {
            totaltime += 1500
        }
        sessionNumber++;

        console.log(totaltime);
        changeSession()
        state = false;
    } else {
        if (state) {
            timeLimit--

        } else {

        }
    }
}
// choosing the time interval accordingly
function changeSession() {
    if (sessionNumber % 2 == 0) {
        if (sessionNumber % longBreakMultiplier == 0) {
            timeLimit = timeLimitLongBreak
            longBreakMultiplier *= 2
        } else {
            timeLimit = timeLimitBreak
        }

    } else {
        timeLimit = timeLimitPomo;
    }

}
//This will initially set the session
changeSession()

let myInt = setInterval(startStopTime, 10)


//function that alters the state
function changeState(e) {
    const prevStat = state;
    if (e.target.classList.contains('start')) {
        state = true
        clock.style.color = ''
    } else {
        state = false;
        clock.style.color = 'rgb(255, 115, 115)'
    }
    if (prevStat != state) {
        startStopTime()
    }
}


//function that converts the seconds to a time 
function convertSec(sec) {
    let seconds = sec % 60
    let minutes = (sec - seconds) / 60
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    let time = `${minutes}:${seconds}`
    return time
}




/////////////////////////////////////////////////////////////////
// Rest of the JS relating to the clock /////////////////////////
/////////////////////////////////////////////////////////////////


// modals
async function openClockModal(e) {
    if (e.currentTarget.classList.contains('itscompleted')) {
        document.querySelector('.overall-task-list').removeChild(e.currentTarget)

    } else {
        let loader = document.querySelector('.second-loader')
        //hide the other layers
        deleteOverallTaskItems()
        loader.style.display = ''
        document.querySelector('main').style.display = 'none'
        document.querySelector('.modal-back').style.display = ''
        //checking what list item was hit
        let id = e.currentTarget.dataset.id

        let taskInfo = await findByID(id)
        document.querySelector('.clock-task-name').textContent = taskInfo.taskName
        //involved in creating the tasks list items
        addCurrentTasks(taskInfo.tasks)
        loader.style.display = 'none'
        let clockBack = document.querySelector('.clock-back')
        clockBack.dataset.id = id
    }


}
//function that returns the searches and returns a task based on id
async function findByID(id) {
    //returning the item by the id
    let url = `http://127.0.0.1:3000/getind/${id}`
    let data = await fetch(url)
    let parsedData = await data.json()
    return parsedData

}

//function that creates the list items from the tasks array then appends them to the list
function addCurrentTasks(tArr) {
    let state = true;
    for (let item of tArr) {
        if (item.completed == false) {
            //where the item is {name:,complete;}
            createCurrentTask(item, state)
            state = false;
        }
    }
    addCompletedLI()

}
//create and add the tasks
function createCurrentTask(item, state) {
    let ul = document.querySelector('.focus-h2')
    let li = document.createElement('li')
    let h = document.createElement('h2')
    li.classList.add('focus-li')
    h.classList.add('current-focus')
    h.textContent = item.task
    li.dataset.taskID = item.taskID
    if (state) {
        li.classList.add('current')
    }
    li.appendChild(h)
    ul.appendChild(li)

}
//function to add a 'completed' thing
function addCompletedLI() {
    let ul = document.querySelector('.focus-h2')
    let li = document.createElement('li')
    let h = document.createElement('h2')
    li.classList.add('focus-li')
    h.classList.add('current-focus')
    li.classList.add('completedLI')
    h.textContent = 'Completed'
    h.style.color = 'rgb(119, 255, 126)'
    li.appendChild(h)
    ul.appendChild(li)

}

document.querySelector('.modal-back').addEventListener('click', (e) => {
    closeModal(e.target)
})

function closeModal(e) {
    if (e == undefined || e.classList.contains('modal-back')) {
        resetEverything()
        getOverallData()
        document.querySelector('main').style.display = ''
        document.querySelector('.modal-back').style.display = 'none'
    }
}


////////////////////////Submit button
let focusPerc = -100
//moving the current focus
document.querySelector('.focus-flex-wrap img').addEventListener('click', submitFocus)
async function submitFocus(e) {
    //right now i am just using a physical counter
    await moveFocus(focusPerc)
    await changeCurrentClass()
    await updateCompletedStatus()
    //changing the current class
}


function changeCurrentClass() {
    let current = document.querySelector('.current')
    let tasklist = document.getElementsByClassName('focus-li')

    current.classList.remove('current')
    tasklist[returnCurrentTask()].classList.add('current')
    let nucurrent = document.querySelector('.current')


}

function moveFocus(perc) {
    let liArr = document.getElementsByClassName('focus-li')
    if (returnMaxTasks() == returnCurrentTask()) {
        //closing the modal when complete or whatever once completed is done
        getOverallData()
        closeModal()
    }
    if (returnMaxTasks() > returnCurrentTask()) {
        for (let li of liArr) {
            li.style.transform = `translateX(${perc}%)`
        }
        focusPerc -= 100
    }
}

function returnMaxTasks() {
    let counterLi = 0;
    let lis = document.getElementsByClassName('focus-li')
    for (let item of lis) {
        if (!item.classList.contains('completedLI')) {
            counterLi++
        }
    }
    // return counterLi
    return counterLi
}
function returnCurrentTask() {
    return (focusPerc / -100) - 1
}


///////////////////////////////// everything works up until this point

//function that updates the task list to say completed
async function updateCompletedStatus() {
    let oid = document.querySelector('.clock-back').dataset.id
    let ind = await returnCompletedNum(oid)
    let iid = document.querySelector('.current').dataset.taskID
    let data = { oid: oid, iid: iid, indNum: ind }
    let putDataRes = await fetch('http://localhost:3000/completed', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

}

async function returnCompletedNum(id) {
    let count = 0;
    let dataun = await fetch(`http://localhost:3000/getind/${id}`)
    let data = await dataun.json()
    let dataArr = data.tasks
    for (let item of dataArr) {
        if (item.completed) {
            count++;
        }
    }
    return count
}


//function that checks if an item is completed
async function isCompleted(id) {
    let count = 0;
    let dataun = await fetch(`http://localhost:3000/getind/${id}`)
    let data = await dataun.json()
    let dataArr = data.tasks
    for (let item of dataArr) {
        if (item.completed) {
            count++;
        }
    }
    return count == dataArr.length
}



/////////////////////////closing the clock modal

function resetEverything() {
    perc = -100
    changeSession()
    deleteOverallTaskItems()
    let totaltime = 0
    let state = false
    let sessionNumber = 1;
    let longBreakMultiplier = 8;

}