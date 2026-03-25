import { describe, it, expect } from 'vitest';
import {
  createTeamAction,
  requestJoinTeamAction,
  leaveTeamAction,
  getTeamsAction,
  getJoinRequestsAction,
} from '@/app/actions/teams';

describe('US002: Join Team', () => {
  describe('Normal Flow', () => {
    it('should successfully send a join request to a team with open spots', async () => {
      const formData = new FormData();
      formData.append('teamId', 'team-1');
      formData.append('playerId', 'player-123');
      formData.append('playerName', 'John Doe');
      formData.append('playerEmail', 'john.doe@mail.mcgill.ca');
      formData.append('message', 'I would like to join');

      const result = await requestJoinTeamAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toContain('Your request to join');
      expect(result.message).toContain('has been sent');
    });
  });

  describe('Error Flows', () => {
    it('should reject join request if team roster is full', async () => {
      const formData = new FormData();
      formData.append('teamId', 'team-2');
      formData.append('playerId', 'player-456');
      formData.append('playerName', 'Jane Smith');
      formData.append('playerEmail', 'jane.smith@mail.mcgill.ca');

      const result = await requestJoinTeamAction(formData);

      expect(result.error).toBe("This team's roster is full.");
    });

    it('should reject duplicate join request', async () => {
      const formData1 = new FormData();
      formData1.append('teamId', 'team-1');
      formData1.append('playerId', 'player-789');
      formData1.append('playerName', 'Bob Wilson');
      formData1.append('playerEmail', 'bob.wilson@mail.mcgill.ca');

      await requestJoinTeamAction(formData1);

      const formData2 = new FormData();
      formData2.append('teamId', 'team-1');
      formData2.append('playerId', 'player-789');
      formData2.append('playerName', 'Bob Wilson');
      formData2.append('playerEmail', 'bob.wilson@mail.mcgill.ca');

      const result = await requestJoinTeamAction(formData2);

      expect(result.error).toBe('You already have a pending request for this team.');
    });

    it('should reject join request for non-existent team', async () => {
      const formData = new FormData();
      formData.append('teamId', 'non-existent-team');
      formData.append('playerId', 'player-999');
      formData.append('playerName', 'Test Player');
      formData.append('playerEmail', 'test@mail.mcgill.ca');

      const result = await requestJoinTeamAction(formData);

      expect(result.error).toBe('Team not found.');
    });
  });
});

describe('US009: Leave Team', () => {
  describe('Normal Flow', () => {
    it('should successfully leave a team when player is a member', async () => {
      const formData = new FormData();
      formData.append('teamId', 'team-1');
      formData.append('playerId', 'player-123');

      const result = await leaveTeamAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('You have left the team.');
    });
  });

  describe('Error Flows', () => {
    it('should reject leave request when player is not a member', async () => {
      const formData = new FormData();
      formData.append('teamId', 'team-empty');
      formData.append('playerId', 'player-999');

      const result = await leaveTeamAction(formData);

      expect(result.error).toBe('You are not a member of this team.');
    });

    it('should reject leave request for non-existent team', async () => {
      const formData = new FormData();
      formData.append('teamId', 'non-existent');
      formData.append('playerId', 'player-123');

      const result = await leaveTeamAction(formData);

      expect(result.error).toBe('Team not found.');
    });
  });
});

describe('US010: Team Creation', () => {
  describe('Normal Flow', () => {
    it('should successfully create a team when user is a Captain', async () => {
      const formData = new FormData();
      formData.append('name', 'Redbirds');
      formData.append('leagueId', '2001');
      formData.append('userRole', 'CAPTAIN');
      formData.append('userId', 'captain-123');
      formData.append('userEmail', 'captain@mail.mcgill.ca');

      const result = await createTeamAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Team Redbirds has been created successfully.');
      expect(result.team).toBeDefined();
      expect(result.team?.name).toBe('Redbirds');
      expect(result.team?.leagueId).toBe('2001');
      expect(result.team?.captainId).toBe('captain-123');
    });

    it('should assign the creator as team captain', async () => {
      const formData = new FormData();
      formData.append('name', 'Stingers');
      formData.append('leagueId', '2002');
      formData.append('userRole', 'CAPTAIN');
      formData.append('userId', 'captain-456');
      formData.append('userEmail', 'captain2@mail.mcgill.ca');

      const result = await createTeamAction(formData);

      expect(result.team?.captainId).toBe('captain-456');
      expect(result.team?.captainEmail).toBe('captain2@mail.mcgill.ca');
    });
  });

  describe('Error Flows', () => {
    it('should reject team creation if name is empty', async () => {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('leagueId', '2001');
      formData.append('userRole', 'CAPTAIN');
      formData.append('userId', 'captain-123');
      formData.append('userEmail', 'captain@mail.mcgill.ca');

      const result = await createTeamAction(formData);

      expect(result.error).toBe('Team name is required.');
    });

    it('should reject team creation if user is not a Captain', async () => {
      const formData = new FormData();
      formData.append('name', 'Test Team');
      formData.append('leagueId', '2001');
      formData.append('userRole', 'PLAYER');
      formData.append('userId', 'player-123');
      formData.append('userEmail', 'player@mail.mcgill.ca');

      const result = await createTeamAction(formData);

      expect(result.error).toBe('Only captains can create teams.');
    });

    it('should reject duplicate team name in same league', async () => {
      const formData1 = new FormData();
      formData1.append('name', 'Warriors');
      formData1.append('leagueId', '2001');
      formData1.append('userRole', 'CAPTAIN');
      formData1.append('userId', 'captain-123');
      formData1.append('userEmail', 'captain@mail.mcgill.ca');

      await createTeamAction(formData1);

      const formData2 = new FormData();
      formData2.append('name', 'Warriors');
      formData2.append('leagueId', '2001');
      formData2.append('userRole', 'CAPTAIN');
      formData2.append('userId', 'captain-456');
      formData2.append('userEmail', 'captain2@mail.mcgill.ca');

      const result = await createTeamAction(formData2);

      expect(result.error).toBe('A team with this name already exists in this league.');
    });

    it('should allow same team name in different leagues', async () => {
      const formData1 = new FormData();
      formData1.append('name', 'Eagles');
      formData1.append('leagueId', '2001');
      formData1.append('userRole', 'CAPTAIN');
      formData1.append('userId', 'captain-123');
      formData1.append('userEmail', 'captain@mail.mcgill.ca');

      await createTeamAction(formData1);

      const formData2 = new FormData();
      formData2.append('name', 'Eagles');
      formData2.append('leagueId', '2002');
      formData2.append('userRole', 'CAPTAIN');
      formData2.append('userId', 'captain-456');
      formData2.append('userEmail', 'captain2@mail.mcgill.ca');

      const result = await createTeamAction(formData2);

      expect(result.error).toBeUndefined();
      expect(result.message).toContain('Eagles has been created successfully');
    });
  });
});
