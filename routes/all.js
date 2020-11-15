var express = require('express');
var router = express.Router();
var mongoose = require(`mongoose`);
let taskModel = require(`../models/taskSchema`);
const { model, modelName } = require('../models/taskSchema');


//post a new task
router.post(`/save`, async function (req, res) {
  let task = new taskModel({
    taskName: req.body.taskName,
    tasks: req.body.tasks,
    date: req.body.date,
    time: req.body.time
  });
  await task.save((err, saved) => {
    if (err) {
      console.log('Theres an error with saving ');
    } else {
      console.log(saved + ' was saved successfully');
    }
  });

  res.send(task);
});

//get all tasks (overall)
router.get('/getoverall', async (req, res) => {
  let dataArr = [];
  await taskModel.find({}, (err, foundTasksArr) => {

    total = foundTasksArr.length;
    for (let item of foundTasksArr) {
      let total = item.tasks.length;
      let completed = 0;
      for (let indTasks of item.tasks) {
        if (indTasks.completed) {
          completed++;
        }
      }
      //before current overall task item ends
      dataArr.push({
        taskName: item.taskName,
        progress: `${completed}/${total}`,
        id: item.id
      });

    }
  });

  res.status(200).send(JSON.stringify(dataArr));

});

//data for the actual pomodoro clock
router.get('/getind/:id', (req, res) => {
  let id = req.params.id
  //finding the correct data and sending it back
  taskModel.findById(id, (err, item) => {
    data = { taskName: item.taskName, date: item.date, tasks: item.tasks, id: item.id, time: item.time }
    res.send(JSON.stringify(data))

  })
})

router.get('/getalldata', (req, res) => {
  taskModel.find({}, (err, datas) => {
    res.status(200).send(JSON.stringify(datas))
  })
})

//find data by id




//route that will UPDATE the completed section
router.put('/completed', async (req, res) => {
  console.log('hit');
  let oid = req.body.oid
  let iid = req.body.iid
  let ind = req.body.indNum


  // //this one is just an example
  // await taskModel.findOneAndUpdate({ _id: oid }, { taskName: 'hey!!!' }, (err, result) => {
  // })


  await taskModel.findById(oid, (error, item) => {
    let taskArr = item.tasks
    if (taskArr[ind]) {
      taskArr[ind].completed = true
      taskModel.findOneAndUpdate({ _id: oid }, { tasks: taskArr }, (err, result) => {
      })
    }


  })

  res.status(200).send('That data was updated')
  //make sure these notes go into the document - You can grab 
})



module.exports = router;
