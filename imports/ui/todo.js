import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './todo.html';

Template.todo.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('todos.setChecked', this._id, !this.checked);
  },
  
  'click .delete'() {
    Meteor.call('todos.remove', this._id);
  }
});

