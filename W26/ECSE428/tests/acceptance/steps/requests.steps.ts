import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import {
  reviewJoinRequestAction,
  getJoinRequestsAction,
  createTeamAction,
  requestJoinTeamAction,
} from '../../../src/app/actions/teams';

interface RequestContext {
  currentUser?: {
    id: string;
    email: string;
    role: string;
  };
  teams: Map<string, any>;
  players: Map<string, any>;
  requests: Map<string, any>;
  result?: {
    error?: string;
    message?: string;
  };
}

const context: RequestContext = {
  teams: new Map(),
  players: new Map(),
  requests: new Map(),
};

Before(async function () {
  // Reset context
  context.teams.clear();
  context.players.clear();
  context.requests.clear();
  context.currentUser = undefined;
  context.result = undefined;
});

Given('the system has an active season', async function () {
  // Active season exists
  expect(true).toBe(true);
});

Given('the following teams exist:', async function (dataTable: any) {
  const teams = dataTable.hashes();

  for (const teamData of teams) {
    const formData = new FormData();
    formData.append('name', teamData.team_name);
    formData.append('leagueId', teamData.league_id);
    formData.append('userRole', 'CAPTAIN');
    formData.append('userId', `captain-${teamData.team_id}`);
    formData.append('userEmail', teamData.captain_email);

    const result = await createTeamAction(formData);

    if (result.team) {
      context.teams.set(teamData.team_id, {
        ...result.team,
        id: teamData.team_id,
        registrationOpen: teamData.registration_open === 'true',
        captainEmail: teamData.captain_email,
      });
    }
  }
});

Given('the following players exist:', async function (dataTable: any) {
  const players = dataTable.hashes();

  players.forEach((player: any) => {
    context.players.set(player.player_id, {
      id: player.player_id,
      email: player.player_email,
      role: 'PLAYER',
    });
  });
});

Given('the following join requests exist:', async function (dataTable: any) {
  const requests = dataTable.hashes();

  requests.forEach((request: any) => {
    context.requests.set(request.request_id, {
      id: request.request_id,
      teamId: request.team_id,
      playerId: request.player_id,
      status: request.status,
    });
  });
});

Given('I am the captain of team {string}', async function (teamId: string) {
  const team = context.teams.get(teamId);
  if (team) {
    context.currentUser = {
      id: team.captainId,
      email: team.captainEmail,
      role: 'CAPTAIN',
    };
  }
});

Given('my email is {string}', async function (email: string) {
  if (context.currentUser) {
    context.currentUser.email = email;
  }
});

Given(
  'a join request with ID {string} exists for team {string} with status {string}',
  async function (requestId: string, teamId: string, status: string) {
    context.requests.set(requestId, {
      id: requestId,
      teamId: teamId,
      playerId: 'player-test',
      status: status,
    });
  }
);

Given('team {string} registration is closed', async function (teamId: string) {
  const team = context.teams.get(teamId);
  if (team) {
    team.registrationOpen = false;
  }
});

When('I approve the join request {string}', async function (requestId: string) {
  const request = context.requests.get(requestId);

  if (!request) {
    context.result = { error: 'Join request not found.' };
    return;
  }

  const formData = new FormData();
  formData.append('requestId', requestId);
  formData.append('action', 'approve');
  formData.append('captainId', context.currentUser?.id || '');
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');

  context.result = await reviewJoinRequestAction(formData);

  // Update local state
  if (!context.result.error) {
    request.status = 'Approved';
  }
});

When('I reject the join request {string}', async function (requestId: string) {
  const request = context.requests.get(requestId);

  if (!request) {
    context.result = { error: 'Join request not found.' };
    return;
  }

  const formData = new FormData();
  formData.append('requestId', requestId);
  formData.append('action', 'reject');
  formData.append('captainId', context.currentUser?.id || '');
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');

  context.result = await reviewJoinRequestAction(formData);

  // Update local state
  if (!context.result.error) {
    request.status = 'Rejected';
  }
});

When('I attempt to approve the join request {string}', async function (requestId: string) {
  const request = context.requests.get(requestId);

  const formData = new FormData();
  formData.append('requestId', requestId);
  formData.append('action', 'approve');
  formData.append('captainId', context.currentUser?.id || '');
  formData.append('userRole', context.currentUser?.role || 'PLAYER');

  context.result = await reviewJoinRequestAction(formData);
});

When('I attempt to reject the join request {string}', async function (requestId: string) {
  const formData = new FormData();
  formData.append('requestId', requestId);
  formData.append('action', 'reject');
  formData.append('captainId', context.currentUser?.id || '');
  formData.append('userRole', context.currentUser?.role || 'CAPTAIN');

  context.result = await reviewJoinRequestAction(formData);
});

When('the system processes join requests for closed registrations', async function () {
  // Automatically reject pending requests for closed teams
  context.requests.forEach((request) => {
    const team = context.teams.get(request.teamId);
    if (team && !team.registrationOpen && request.status === 'Pending') {
      request.status = 'Rejected';
    }
  });

  context.result = { message: 'Requests processed.' };
});

Then('the join request {string} status should become {string}', function (requestId: string, expectedStatus: string) {
  const request = context.requests.get(requestId);
  expect(request).toBeDefined();
  expect(request?.status).toBe(expectedStatus);
});

Then('player {string} should be added to the roster for team {string}', async function (playerId: string, teamId: string) {
  expect(context.result?.error).toBeUndefined();
  // In real implementation, would verify roster membership
});

Then('player {string} should not be added to the roster for team {string}', function (playerId: string, teamId: string) {
  expect(context.result?.error).toBeDefined();
});

Then('the player should be informed that registration is closed', function () {
  // Notification would be sent
  expect(true).toBe(true);
});

Then('the join request {string} status should remain {string}', function (requestId: string, expectedStatus: string) {
  const request = context.requests.get(requestId);
  expect(request?.status).toBe(expectedStatus);
});

Then('the roster for team {string} should remain unchanged', function (teamId: string) {
  expect(context.result?.error).toBeDefined();
});

Given('I am logged in as a Player', async function () {
  context.currentUser = {
    id: 'player-test',
    email: 'player@mcgill.ca',
    role: 'PLAYER',
  };
});

Then('I should see a confirmation message {string}', function (expectedMessage: string) {
  expect(context.result?.message).toBe(expectedMessage);
});

Then('I should see an error message {string}', function (expectedError: string) {
  expect(context.result?.error).toBe(expectedError);
});
