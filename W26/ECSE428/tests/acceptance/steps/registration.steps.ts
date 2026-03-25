import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import { registerAction, loginAction, getRegisteredUsers } from '../../../src/app/actions/auth';

interface RegistrationContext {
  email?: string;
  password?: string;
  name?: string;
  result?: {
    error?: string;
    message?: string;
    user?: any;
  };
}

const context: RegistrationContext = {};

Before(async function () {
  // Reset context before each scenario
  Object.keys(context).forEach((key) => delete context[key as keyof RegistrationContext]);

  // Clear registered users
  const users = await getRegisteredUsers();
  users.length = 0;
});

Given('the registration system is available', async function () {
  // System is always available in this implementation
  expect(true).toBe(true);
});

Given('a user with email {string} already exists', async function (email: string) {
  const formData = new FormData();
  formData.append('name', 'Existing User');
  formData.append('email', email);
  formData.append('password', 'ExistingPass1!');
  formData.append('confirmPassword', 'ExistingPass1!');

  await registerAction(formData);
});

When(
  'I submit registration details with email {string}, password {string}, and name {string}',
  async function (email: string, password: string, name: string) {
    context.email = email;
    context.password = password;
    context.name = name;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', password);

    context.result = await registerAction(formData);
  }
);

When(
  'I submit registration details with email {string}, password {string}, and empty name',
  async function (email: string, password: string) {
    context.email = email;
    context.password = password;
    context.name = '';

    const formData = new FormData();
    formData.append('name', '');
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', password);

    context.result = await registerAction(formData);
  }
);

Then('an account should be created with email {string}', async function (email: string) {
  const users = await getRegisteredUsers();
  const user = users.find((u) => u.email === email);

  expect(user).toBeDefined();
  expect(user?.email).toBe(email);
});

Then('I should see a confirmation message {string}', function (expectedMessage: string) {
  expect(context.result?.message).toBe(expectedMessage);
});

Then('I should be assigned the Player role by default', async function () {
  const users = await getRegisteredUsers();
  const user = users.find((u) => u.email === context.email);

  expect(user?.role).toBe('PLAYER');
});

Then('I should see an error message {string}', function (expectedError: string) {
  expect(context.result?.error).toBe(expectedError);
});

Then('no new account should be created', async function () {
  const users = await getRegisteredUsers();
  const matchingUsers = users.filter((u) => u.email === context.email);

  // Only one user with this email should exist (the pre-existing one)
  expect(matchingUsers.length).toBe(1);
});

// Login steps
Given('I am a registered user with email {string} and password {string}', async function (email: string, password: string) {
  const formData = new FormData();
  formData.append('name', 'Test User');
  formData.append('email', email);
  formData.append('password', password);
  formData.append('confirmPassword', password);

  await registerAction(formData);
});

When('I submit login details with email {string} and password {string}', async function (email: string, password: string) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  context.result = await loginAction(formData);
});

Then('I should be successfully logged in', function () {
  expect(context.result?.error).toBeUndefined();
  expect(context.result?.user).toBeDefined();
});

Then('I should see my profile information', function () {
  expect(context.result?.user?.email).toBe(context.email);
  expect(context.result?.user?.name).toBeDefined();
});
