let mongoose = require(`mongoose`);
let schema = mongoose.Schema;

let taskSchema = new mongoose.Schema({
  taskName: String,
  tasks: Array,
  //This will be an array of objects {task,completed,id}
  date: String,
  time: Number,
});

module.exports = mongoose.model('taskModel', taskSchema);
