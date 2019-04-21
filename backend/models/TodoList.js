const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TodoListSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  todos: [{
    type: Schema.Types.ObjectId, 
    ref: 'Todo'
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = TodoList = mongoose.model("TodoList", TodoListSchema);
