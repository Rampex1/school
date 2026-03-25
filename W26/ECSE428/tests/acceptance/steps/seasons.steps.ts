import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import { createSeasonAction, getSeasonsAction } from '../../../src/app/actions/seasons';

interface SeasonContext {
  currentUser?: {
    id: string;
    role: string;
  };
  result?: {
    error?: string;
    message?: string;
  };
  seasonName?: string;
}

const context: SeasonContext = {};

Before(async function () {
  // Reset context
  Object.keys(context).forEach((key) => delete context[key as keyof SeasonContext]);
});

Given('a user account exists with Organizer role', async function () {
  context.currentUser = {
    id: 'organizer-test',
    role: 'ADMINISTRATOR',
  };
});

Given('I am logged in as an Organizer', async function () {
  context.currentUser = {
    id: 'organizer-test',
    role: 'ADMINISTRATOR',
  };
});

Given('a season {string} already exists with status {string}', async function (seasonName: string, status: string) {
  const formData = new FormData();
  formData.append('name', seasonName);
  formData.append('startDate', '2026-01-12');
  formData.append('endDate', '2026-04-15');
  formData.append('userRole', 'ADMINISTRATOR');

  await createSeasonAction(formData);
});

When(
  'I create a new season with name {string}, start date {string}, and end date {string}',
  async function (name: string, startDate: string, endDate: string) {
    context.seasonName = name;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('userRole', context.currentUser?.role || 'ADMINISTRATOR');

    context.result = await createSeasonAction(formData);
  }
);

When(
  'I attempt to create a new season with name {string}, start date {string}, and end date {string}',
  async function (name: string, startDate: string, endDate: string) {
    context.seasonName = name;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('userRole', context.currentUser?.role || 'ADMINISTRATOR');

    context.result = await createSeasonAction(formData);
  }
);

When(
  'I attempt to create a new season without a name, start date {string}, and end date {string}',
  async function (startDate: string, endDate: string) {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('userRole', context.currentUser?.role || 'ADMINISTRATOR');

    context.result = await createSeasonAction(formData);
  }
);

When('I attempt to create a new season', async function () {
  const formData = new FormData();
  formData.append('name', 'Test Season');
  formData.append('startDate', '2026-01-12');
  formData.append('endDate', '2026-04-15');
  formData.append('userRole', context.currentUser?.role || 'PLAYER');

  context.result = await createSeasonAction(formData);
});

Then('the season {string} should be created', async function (seasonName: string) {
  expect(context.result?.error).toBeUndefined();

  const seasons = await getSeasonsAction();
  const createdSeason = seasons.find((s) => s.name === seasonName);

  expect(createdSeason).toBeDefined();
});

Then('the season status should be {string}', async function (expectedStatus: string) {
  const seasons = await getSeasonsAction();
  const season = seasons.find((s) => s.name === context.seasonName);

  expect(season).toBeDefined();

  if (expectedStatus === 'Active') {
    expect(season?.isActive).toBe(true);
  } else {
    expect(season?.isActive).toBe(false);
  }
});

Then('I should see a confirmation message {string}', function (expectedMessage: string) {
  expect(context.result?.message).toBe(expectedMessage);
});

Then('I should see an error message {string}', function (expectedError: string) {
  expect(context.result?.error).toBe(expectedError);
});
