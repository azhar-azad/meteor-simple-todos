import { Template } from 'meteor/templating';

import { Todos } from "../api/todos";

import './body.html';

Template.body.helpers({
  todos() {
    return Todos.find({}, { sort: { createdAt: -1 } });
  }
});

Template.body.events({
  'submit .new-todo'(event) {
    event.preventDefault();
    
    const todo = event.target.todo.value;
    console.log(todo);
    
    Todos.insert({
      text: todo,
      createdAt: new Date()
    });
    
    event.target.todo.value = '';
  }
});