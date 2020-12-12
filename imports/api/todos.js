import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Todos = new Mongo.Collection('todos');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish todos that are public or belong to the current user
  Meteor.publish('todos', function todosPublication() {
    return Todos.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  });
}

Meteor.methods({
  'todos.insert'(text) {
    check(text, String);
    
    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Todos.insert({
      text: text, // todo name
      createdAt: new Date(), // time of the todo creation
      owner: this.userId, // the _id of the user that created the todo
      username: Meteor.users.findOne(this.userId).username // the username of the user that created the todo
    });
    /*
    A new task is added to the Todos collection by calling Todos.insert().
    Any properties to the task object can be assigned, such as the time created,
    since there is no need to define a schema for the collection.
    
    owner and username fields are added so that
    the app can only display the new task input field to logged in users,
    and also to show which user created each task.
    
    The username is saved directly in the todo object so that
    the app doesn't have to look up the user every time it displays the task.
     */
  },
  
  'todos.remove'(todoId) {
    check(todoId, String);
    
    const todo = Todos.findOne(todoId);
    if (todo.owner !== this.userId) {
      // If the todo is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Todos.remove(todoId);
    /*
    The remove function takes one argument,
    a selector that determines which item to remove from the collection.
     */
  },
  
  'todos.setChecked'(todoId, setChecked) {
    check(todoId, String);
    check(setChecked, Boolean);
    
    const todo = Todos.findOne(todoId);
    if (todo.owner !== this.userId) {
      // If the todo is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    
    Todos.update(todoId, { $set: { checked: setChecked } });
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
  
  'todos.setPrivate'(todoId, setToPrivate) {
    check(todoId, String);
    check(setToPrivate, Boolean);
    
    const todo = Todos.findOne(todoId);
    
    // Make sure only the todo owner can make a todo private
    if (todo.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Todos.update(todoId, { $set: { private: setToPrivate } });
  }
});