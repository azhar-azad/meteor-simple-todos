import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  // accounts-ui is configured to use username instead of email address
  passwordSignupFields: 'USERNAME_ONLY'
});