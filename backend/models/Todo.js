const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Todo = new Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  responsible: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = Todo = mongoose.model("Todo", TodoListSchema);
