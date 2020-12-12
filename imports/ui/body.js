import { Template } from 'meteor/templating';

import { Todos } from "../api/todos";

import './body.html';
import './todo';

Template.body.helpers({
  todos() {
    return Todos.find({}, { sort: { createdAt: -1 } });
  }
});

Template.body.events({
  'submit .new-todo'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    
    // Get value from form element
    const todo = event.target.todo.value;
    
    // Insert a task(todo) into the collection
    Todos.insert({
      text: todo,
      createdAt: new Date()
    });
    /*
    We are adding a task to the tasks collection by calling Tasks.insert().
    We can assign any properties to the task object, such as the time created,
    since we don't ever have to define a schema for the collection.
     */
    
    // Clear form
    event.target.todo.value = '';
  }
});