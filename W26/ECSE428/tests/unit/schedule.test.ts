import { describe, it, expect } from 'vitest';
import { getScheduleDataAction, rescheduleGameAction } from '@/app/actions/schedule';

describe('US004: Schedule Management', () => {
  describe('Normal Flow', () => {
    it('should retrieve schedule data successfully', async () => {
      const result = await getScheduleDataAction();

      expect(result).toBeDefined();
      expect(result.games).toBeDefined();
      expect(result.leagues).toBeDefined();
      expect(result.teams).toBeDefined();
      expect(Array.isArray(result.games)).toBe(true);
    });

    it('should provide schedule statistics', async () => {
      const result = await getScheduleDataAction();

      expect(result.activeLeagueCount).toBeDefined();
      expect(result.upcomingGamesCount).toBeDefined();
      expect(result.teamsRequiringAttention).toBeDefined();
      expect(result.schedulingConflicts).toBeDefined();
      expect(typeof result.activeLeagueCount).toBe('number');
      expect(typeof result.upcomingGamesCount).toBe('number');
    });

    it('should successfully reschedule a game as administrator', async () => {
      const formData = new FormData();
      formData.append('gameId', 'game-1');
      formData.append('newDateTime', '2026-03-15T14:00:00');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Game rescheduled successfully.');
    });
  });

  describe('Error Flows', () => {
    it('should reject rescheduling by non-administrator', async () => {
      const formData = new FormData();
      formData.append('gameId', 'game-1');
      formData.append('newDateTime', '2026-03-15T14:00:00');
      formData.append('userRole', 'PLAYER');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Access Denied');
    });

    it('should reject rescheduling by Captain', async () => {
      const formData = new FormData();
      formData.append('gameId', 'game-1');
      formData.append('newDateTime', '2026-03-15T14:00:00');
      formData.append('userRole', 'CAPTAIN');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Access Denied');
    });

    it('should reject rescheduling to past date', async () => {
      const formData = new FormData();
      formData.append('gameId', 'game-1');
      formData.append('newDateTime', '2020-01-01T14:00:00');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Cannot schedule games in the past.');
    });

    it('should reject rescheduling non-existent game', async () => {
      const formData = new FormData();
      formData.append('gameId', 'non-existent-game');
      formData.append('newDateTime', '2026-03-15T14:00:00');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Game not found.');
    });

    it('should reject rescheduling without game ID', async () => {
      const formData = new FormData();
      formData.append('gameId', '');
      formData.append('newDateTime', '2026-03-15T14:00:00');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Game and new date/time are required.');
    });

    it('should reject rescheduling without new date/time', async () => {
      const formData = new FormData();
      formData.append('gameId', 'game-1');
      formData.append('newDateTime', '');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await rescheduleGameAction(formData);

      expect(result.error).toBe('Game and new date/time are required.');
    });
  });

  describe('Scheduling Conflicts Detection', () => {
    it('should detect and report scheduling conflicts', async () => {
      const result = await getScheduleDataAction();

      expect(result.schedulingConflicts).toBeDefined();
      expect(typeof result.schedulingConflicts).toBe('number');
      expect(result.schedulingConflicts).toBeGreaterThanOrEqual(0);
    });

    it('should identify teams requiring attention', async () => {
      const result = await getScheduleDataAction();

      expect(result.teamsRequiringAttention).toBeDefined();
      expect(typeof result.teamsRequiringAttention).toBe('number');
      expect(result.teamsRequiringAttention).toBeGreaterThanOrEqual(0);
    });
  });
});
