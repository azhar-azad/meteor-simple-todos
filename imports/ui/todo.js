import { Template } from 'meteor/templating';

import { Todos } from "../api/todos";

import './todo.html';

Template.todo.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Todos.update(this._id, {
      $set: { checked: !this.checked }
    });
    /*
    The update function on a collection takes two arguments.
    The first is a selector that identifies a subset of the collection,
    and the second is an update parameter that specifies
    what should be done to the matched objects.
    
    In this case, the selector is just the _id of the relevant task.
    The update parameter uses $set to toggle the checked field,
    which will represent whether the task has been completed.
     */
  },
  
  'click .delete'() {
    Todos.remove(this._id);
    /*
    The remove function takes one argument,
    a selector that determines which item to remove from the collection.
     */
  }
});