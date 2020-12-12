import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor'; // while using accounts-ui, accounts-password package

import { Todos } from "../api/todos.js";

import './body.html';
import './todo';

Template.body.onCreated(function bodyOnCreated() {
  /*
  Adding a client-side data filtering feature in the app, so that the users
  can check a box to only see incomplete tasks. For this ReactiveDict will be used.
  Learn about ReactiveDict [ https://atmospherejs.com/meteor/reactive-dict ]
  
  ReactiveDice: ReactiveDict is a reactive data source like Mongo collections,
  but is not synced with the server like collections are.
  This makes a ReactiveDict a convenient place to store temporary UI state
  like the checkbox (Hide Completed Tasks)
  
  Setting up a new ReactiveDict and attach it to the body template instance
  (as this is where the checkbox's state will be stored) when it is first created.
   */
  this.state = new ReactiveDict();
  Meteor.subscribe('todos');
});

Template.body.helpers({
  // Return the todos from MongoDB to template (body.html)
  todos() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Todos.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Todos.find({}, { sort: { createdAt: -1 } });
  },
  
  // Return the count of todos that are not completed yet
  // i.e. those todos that have checked property set to true
  incompleteCount() {
    return Todos.find({ checked: { $ne: true } }).count();
  }
});

Template.body.events({
  'submit .new-todo'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    
    // Get value from form element
    const todoName = event.target.todo.value;
    
    // Insert a task(todo) into the collection
    Meteor.call('todos.insert', todoName);
    
    // Clear form
    event.target.todo.value = '';
  },
  
  /*
  Added an event handler to update the ReactiveDice variable
  when the checkbox is checked or unchecked.
   */
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});