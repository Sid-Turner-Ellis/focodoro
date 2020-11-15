getOverallData()
//Adding a transition time
let transitionTime = 0.7;
document.getElementsByClassName(
  'form'
)[0].style.transition = `${transitionTime}s`;
document.getElementsByClassName(
  'form'
)[1].style.transition = `${transitionTime}s`;

//Move the input form to the right
document.querySelector('.form-wrapper').addEventListener(`click`, OverallForm);
let arrayOfTasks = [];
function OverallForm(e) {
  //click the tick for choosing the overall project name
  if (e.target.classList.contains('tick')) {
    translateInputs('-100');
    hideListOnState();
  }
  //add a smaller task to the list
  if (e.target.classList.contains('right-arrow')) {
    createListItem();
    hideListOnState();
  }
  if (e.target.classList.contains('left-arrow')) {
    translateInputs('0');
    hideListOnState();
  }
  if (e.target.classList.contains('submit-pomo')) {
    submitSession();
    hideListOnState();
  }
}

function translateInputs(perc) {
  document.querySelectorAll(
    `.form`
  )[0].style.transform = `translateX(${perc}%)`;
  document.querySelectorAll(
    `.form`
  )[1].style.transform = `translateX(${perc}%)`;
}

function createListItem() {
  let task = document.querySelector('.ind-input').value;
  document.querySelector('.ind-input').value = null;
  if (task.length > 0) {
    arrayOfTasks.push(task);
    //create the actual list item
    let li = document.createElement(`li`);
    li.classList.add('temp-li');
    li.innerHTML = `<p contenteditable="true" class="item">${task}</p><p class="delete">&times;</p>`;
    li.addEventListener(`click`, deleteTempLi);
    //add the transition
    if (arrayOfTasks.length % 2 == 0) {
      li.classList.add('enterLiLe');
    } else {
      li.classList.add('enterLiRi');
    }
    //append the list item
    document.querySelector(`.temp-list`).appendChild(li);
  }
}

function deleteTempLi(e) {
  let li = e.target.parentElement;
  let height = li.getBoundingClientRect().height;
  let totalLi = document.getElementsByClassName(`temp-li`);

  //check the delete icon is pressed
  if (e.target.classList.contains(`delete`)) {
    //handles the animations
    if (li.classList.contains('enterLiLe')) {
      li.classList.add('enterLiRiRev');
    } else {
      li.classList.add('enterLiLeRev');
    }
    setTimeout(() => {
      document.querySelector(`.temp-list`).removeChild(li);
    }, 1000);
  }

  // //move rest of cards
  // let iNumber;
  // for (let i = 0; i < totalLi.length; i++) {
  //   if (li == totalLi[i]) {
  //     iNumber = i;
  //   }
  // }
  // for (let b = iNumber; b < totalLi.length; b++) {
  //   totalLi[b].classList = `temp-li`;
  //   totalLi[b].style.translate = `transformY(-${height}px)`;
  // }
  // console.log(iNumber);
}

function deleteAllTempLi() {
  let LI = document.querySelectorAll('.temp-li');
  for (let item of LI) {
    document.querySelector('.temp-list').removeChild(item);
  }
}

//submit function
async function submitSession() {
  debugger;

  let taskName = document.querySelector(`.overall-input`).value;


  if (!formCheck()) {
    //show an error or something
  } else {
    await updateTaskArr();
    //the object for the task
    let loader = document.querySelector('.loader');
    loader.style.display = '';
    let completeTask = {
      taskName: taskName,
      tasks: arrayOfTasks,
      date: createDate(),
      time: 0
    };

    let test = await fetch('http://127.0.0.1:3000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeTask),
    });
    let testJson = await test.json();


    deleteOverallTaskItems()
    resetFields();
    translateInputs(0);
    deleteAllTempLi();

    await getOverallData();



  }
}

//update task array function
async function updateTaskArr() {
  arrayOfTasks = [];
  let totalIt = document.getElementsByClassName(`item`);
  if (totalIt.length > 0) {
    for (let i = 0; i < totalIt.length; i++) {
      let data = { task: totalIt[i].textContent, completed: false, taskID: await getID() }
      arrayOfTasks.push(data);
    }

  }

}

//function to fetch a random id
async function getID() {
  let unparsedID = await fetch('https://www.uuidgenerator.net/api/version4/1')
  let ID = await unparsedID.text()
  return ID
  //remember to use await wherever this function is used...
}


//function that checks if form was filled
function formCheck() {
  let Overallinput = document.querySelector(`.overall-input`);
  let indInput = document.querySelector(`.ind-input`);
  let failColor = `#ff7c75`;

  if (Overallinput.value == '') {
    //fail
    Overallinput.parentElement.style.border = `2px solid ${failColor}`;
    addShake();

    setTimeout(() => { }, 200);
    translateInputs(0);
    return false;
  } else {
    //success
    Overallinput.parentElement.style.border = '';
    Overallinput.style.backgroundColor = '';
  }
  if (document.getElementsByClassName(`item`).length == 0) {
    //fail

    indInput.parentElement.style.border = `2px solid ${failColor}`;
    addShake();
    return false;
  } else {
    //success
    indInput.parentElement.style.border = '';
    indInput.parentElement.style.backgroundColor = '';
  }
  return true;
}
//function that adds and removes the shake animation
function addShake() {
  let forms = document.getElementsByClassName('form-wrapper');
  forms[0].style.animation = `shake 1s `;
  setTimeout(() => {
    forms[0].style.animation = 'nothin';
  }, 1000);
}

//date creating functionality
function createDate() {
  let date = new Date();
  let dateDay = addZero(date.getDate());
  let dateMonth = addZero(fixMonths(date.getMonth()));
  let dateYear = date.getFullYear();
  let dateHours = addZero(date.getHours());
  let dateMinutes = addZero(date.getMinutes());
  let fullDate = `${dateDay}/${dateMonth}/${dateYear} ${dateHours}:${dateMinutes}`;
  return fullDate;
}
function fixMonths(m) {
  return m + 1;
}
function addZero(d) {
  if (d < 10) {
    return `0${d}`;
  } else {
    return d;
  }
}

//function that will render/create the overall task list items
function createTaskItem(item, prog, id, completed) {
  //create the actual item
  let li = document.createElement('li');
  li.classList.add('overall-task-li');
  li.dataset.id = id
  li.innerHTML = `<p class="overall-task-item">${item}</p><p class="overall-task-prog">${prog}</p>`;
  document.querySelector('.overall-task-list').appendChild(li);
  li.addEventListener('click', openClockModal)
  if (completed) {
    li.style.backgroundColor = 'rgb(119, 255, 126)'
    li.classList.add('itscompleted')
  }
}



//function that grabs the overview data from the database
async function getOverallData() {

  let loader = document.querySelector('.loader');
  loader.style.display = '';
  //overall task names

  let dataArr = await fetch('http://127.0.0.1:3000/getOverall');
  let dataArrJSON = await dataArr.json();
  if ((await dataArrJSON.length) > 0) {
    document.querySelector('.overall-task-picker').style.display = '';
  }

  //This function deletes all the previous list items just in case the main function is called more than once
  //////////////NOTE! You need to be aware of functions being called in async functions...You might need the await of them 
  for (let item of dataArrJSON) {
    let itsCompleted = await isCompleted(item.id)
    createTaskItem(item.taskName, item.progress, item.id, itsCompleted);
  }
  // deleteOverallTaskItems();

  loader.style.display = 'none';
  return dataArrJSON

}

function deleteOverallTaskItems() {
  let allTaskItems = document.querySelectorAll('.overall-task-li');
  for (let ti of allTaskItems) {
    document.querySelector('.overall-task-list').removeChild(ti);
  }
}
//Calling it on page load

function resetFields() {
  document.querySelector('.overall-input').value = '';
  document.querySelector('.ind-input').value = '';
}

//checking where we are on the page, 1 is first page 2 is second
function checkState() {
  let state = document
    .querySelectorAll('.form')[0]
    .style.transform.match(/100/gi);
  if (state) {
    return '2';
  } else {
    return '1';
  }
}

function hideListOnState() {
  if (checkState() == 2) {
    document.querySelector('.overall-task-picker').style.display = 'none';
    document.querySelector('.temp-list').style.display = '';
  } else {
    document.querySelector('.overall-task-picker').style.display = '';
    document.querySelector('.temp-list').style.display = 'none';

  }
}


