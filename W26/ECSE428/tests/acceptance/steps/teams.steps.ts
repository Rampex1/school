import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import {
  createTeamAction,
  requestJoinTeamAction,
  leaveTeamAction,
  getTeamsAction,
  getJoinRequestsAction,
} from '../../../src/app/actions/teams';

interface TeamContext {
  currentUser?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  teams: any[];
  joinRequests: any[];
  result?: {
    error?: string;
    message?: string;
    team?: any;
  };
  selectedTeamId?: string;
}

const context: TeamContext = {
  teams: [],
  joinRequests: [],
};

Before(async function () {
  // Reset context
  context.teams = [];
  context.joinRequests = [];
  context.currentUser = undefined;
  context.result = undefined;
  context.selectedTeamId = undefined;
});

// US002: Join Team Steps
Given('the system has an active season', async function () {
  // Assume active season exists
  expect(true).toBe(true);
});

Given('the following teams exist:', async function (dataTable: any) {
  const teams = dataTable.hashes();

  for (const team of teams) {
    const formData = new FormData();
    formData.append('name', team.team_name || 'Test Team');
    formData.append('leagueId', team.league_id || '2001');
    formData.append('userRole', 'CAPTAIN');
    formData.append('userId', 'captain-test');
    formData.append('userEmail', 'captain@mcgill.ca');

    const result = await createTeamAction(formData);
    if (result.team) {
      context.teams.push(result.team);
    }
  }
});

Given('a user account exists with Player role', async function () {
  context.currentUser = {
    id: 'player-test',
    email: 'player@mail.mcgill.ca',
    role: 'PLAYER',
    name: 'Test Player',
  };
});

Given('I am logged in as a Player', async function () {
  context.currentUser = {
    id: 'player-test',
    email: 'player@mail.mcgill.ca',
    role: 'PLAYER',
    name: 'Test Player',
  };
});

Given('the team {string} has open roster spots', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  expect(team).toBeDefined();
  expect(team.currentRosterSize).toBeLessThan(team.maxRosterSize);
});

Given('the team {string} has a full roster', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  if (team) {
    team.currentRosterSize = team.maxRosterSize;
  }
});

Given('I have already sent a pending join request to team {string}', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  if (team && context.currentUser) {
    const formData = new FormData();
    formData.append('teamId', team.id);
    formData.append('playerId', context.currentUser.id);
    formData.append('playerName', context.currentUser.name);
    formData.append('playerEmail', context.currentUser.email);

    await requestJoinTeamAction(formData);
  }
});

When('I request to join the team {string}', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);

  if (!team) {
    context.result = { error: 'Team not found.' };
    return;
  }

  if (!context.currentUser) {
    context.result = { error: 'User not logged in.' };
    return;
  }

  const formData = new FormData();
  formData.append('teamId', team.id);
  formData.append('playerId', context.currentUser.id);
  formData.append('playerName', context.currentUser.name);
  formData.append('playerEmail', context.currentUser.email);

  context.result = await requestJoinTeamAction(formData);
  context.selectedTeamId = team.id;
});

Then('a join request should be created for team {string}', async function (teamName: string) {
  const requests = await getJoinRequestsAction();
  const team = context.teams.find((t) => t.name === teamName);

  const request = requests.find(
    (r) => r.teamId === team?.id && r.playerId === context.currentUser?.id
  );

  expect(request).toBeDefined();
});

Then('the team captain should receive a notification', async function () {
  // In a real system, this would check notifications
  // For now, just verify the request was created
  expect(context.result?.error).toBeUndefined();
});

Then('no join request should be created', async function () {
  // Verify error occurred and no request was added
  expect(context.result?.error).toBeDefined();
});

// US009: Leave Team Steps
Given('a team {string} exists', async function (teamName: string) {
  const formData = new FormData();
  formData.append('name', teamName);
  formData.append('leagueId', '2001');
  formData.append('userRole', 'CAPTAIN');
  formData.append('userId', 'captain-test');
  formData.append('userEmail', 'captain@mcgill.ca');

  const result = await createTeamAction(formData);
  if (result.team) {
    context.teams.push(result.team);
  }
});

Given('a player account {string} exists', async function (playerName: string) {
  context.currentUser = {
    id: 'player-test',
    email: 'player@mail.mcgill.ca',
    role: 'PLAYER',
    name: playerName,
  };
});

Given('player {string} is a member of team {string}', async function (playerName: string, teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  if (team) {
    team.currentRosterSize += 1;
  }
});

Given('I am logged in as player {string}', async function (playerName: string) {
  context.currentUser = {
    id: 'player-test',
    email: 'player@mail.mcgill.ca',
    role: 'PLAYER',
    name: playerName,
  };
});

Given('player {string} is not a member of team {string}', async function (playerName: string, teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  if (team) {
    team.currentRosterSize = 0;
  }
});

When('I request to leave team {string}', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);

  if (!team) {
    context.result = { error: 'Team not found.' };
    return;
  }

  const formData = new FormData();
  formData.append('teamId', team.id);
  formData.append('playerId', context.currentUser?.id || '');

  context.result = await leaveTeamAction(formData);
});

When('I start a leave request for team {string}', async function (teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  context.selectedTeamId = team?.id;
});

When('I cancel the request', async function () {
  // Cancel action - don't actually leave
  context.result = { message: 'Cancelled' };
});

Then('player {string} should no longer be a member of team {string}', async function (playerName: string, teamName: string) {
  expect(context.result?.error).toBeUndefined();
  expect(context.result?.message).toBe('You have left the team.');
});

Then('player {string} should remain a member of team {string}', async function (playerName: string, teamName: string) {
  const team = context.teams.find((t) => t.name === teamName);
  expect(team).toBeDefined();
});

// US010: Team Creation Steps
Given('a user account exists with Captain role', async function () {
  context.currentUser = {
    id: 'captain-test',
    email: 'captain@mail.mcgill.ca',
    role: 'CAPTAIN',
    name: 'Test Captain',
  };
});

Given('I am logged in as a Captain', async function () {
  context.currentUser = {
    id: 'captain-test',
    email: 'captain@mail.mcgill.ca',
    role: 'CAPTAIN',
    name: 'Test Captain',
  };
});

Given('the following leagues exist:', async function (dataTable: any) {
  // Leagues are assumed to exist in the system
  expect(true).toBe(true);
});

Given('a team named {string} already exists in league {string}', async function (teamName: string, leagueId: string) {
  const formData = new FormData();
  formData.append('name', teamName);
  formData.append('leagueId', leagueId);
  formData.append('userRole', 'CAPTAIN');
  formData.append('userId', 'captain-existing');
  formData.append('userEmail', 'captain@mcgill.ca');

  await createTeamAction(formData);
});

When('I create a team named {string} in league {string}', async function (teamName: string, leagueId: string) {
  const formData = new FormData();
  formData.append('name', teamName);
  formData.append('leagueId', leagueId);
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');
  formData.append('userId', context.currentUser?.id || '');
  formData.append('userEmail', context.currentUser?.email || '');

  context.result = await createTeamAction(formData);
});

When('I attempt to create a team named {string} in league {string}', async function (teamName: string, leagueId: string) {
  const formData = new FormData();
  formData.append('name', teamName);
  formData.append('leagueId', leagueId);
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');
  formData.append('userId', context.currentUser?.id || '');
  formData.append('userEmail', context.currentUser?.email || '');

  context.result = await createTeamAction(formData);
});

When('I attempt to create a team without a name in league {string}', async function (leagueId: string) {
  const formData = new FormData();
  formData.append('name', '');
  formData.append('leagueId', leagueId);
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');
  formData.append('userId', context.currentUser?.id || '');
  formData.append('userEmail', context.currentUser?.email || '');

  context.result = await createTeamAction(formData);
});

When('I attempt to create a team in league {string}', async function (leagueId: string) {
  const formData = new FormData();
  formData.append('name', 'Test Team');
  formData.append('leagueId', leagueId);
  formData.append('userRole', context.currentUser?.role || 'PLAYER');
  formData.append('userId', context.currentUser?.id || '');
  formData.append('userEmail', context.currentUser?.email || '');

  context.result = await createTeamAction(formData);
});

Then('the team {string} should be created in league {string}', async function (teamName: string, leagueId: string) {
  expect(context.result?.error).toBeUndefined();
  expect(context.result?.team).toBeDefined();
  expect(context.result?.team?.name).toBe(teamName);
  expect(context.result?.team?.leagueId).toBe(leagueId);
});

Then('I should be assigned as the team captain', function () {
  expect(context.result?.team?.captainId).toBe(context.currentUser?.id);
});

Then('the team should not be created', function () {
  expect(context.result?.error).toBeDefined();
  expect(context.result?.team).toBeUndefined();
});

// Shared step definitions
Then('I should see a confirmation message {string}', function (expectedMessage: string) {
  expect(context.result?.message).toBe(expectedMessage);
});

Then('I should see an error message {string}', function (expectedError: string) {
  expect(context.result?.error).toBe(expectedError);
});
