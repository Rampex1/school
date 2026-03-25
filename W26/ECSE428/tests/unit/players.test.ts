import { describe, it, expect } from 'vitest';
import {
  searchPlayersAction,
  updateSkillLevelAction,
  updateAvailabilityAction,
} from '@/app/actions/players';

describe('US005: Find Other Players', () => {
  describe('Normal Flow', () => {
    it('should find players by exact name', async () => {
      const result = await searchPlayersAction('Alex Chen');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should return limited profile information only', async () => {
      const result = await searchPlayersAction('Alex');

      if (result.results && result.results.length > 0) {
        const player = result.results[0];
        expect(player.displayName).toBeDefined();
        expect(player.teamName).toBeDefined();
        expect(player.status).toBeDefined();
        expect(player.skillLevel).toBeDefined();
        // Ensure sensitive fields are not present
        expect(player).not.toHaveProperty('email');
        expect(player).not.toHaveProperty('phone');
        expect(player).not.toHaveProperty('address');
      }
    });

    it('should find players by partial name (typeahead)', async () => {
      const result = await searchPlayersAction('Ali');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
    });

    it('should limit results to 20 matches', async () => {
      const result = await searchPlayersAction('a');

      if (result.results) {
        expect(result.results.length).toBeLessThanOrEqual(20);
      }
    });
  });

  describe('Alternate Flow', () => {
    it('should handle non-exact match queries', async () => {
      const result = await searchPlayersAction('Chris Ngu');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
    });

    it('should handle case-insensitive search', async () => {
      const result = await searchPlayersAction('ALEX CHEN');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
    });

    it('should trim leading and trailing spaces', async () => {
      const result = await searchPlayersAction('  Alex Chen  ');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
    });
  });

  describe('Error Flows', () => {
    it('should reject empty search query', async () => {
      const result = await searchPlayersAction('');

      expect(result.error).toBe('Enter a name or email to search');
      expect(result.results).toBeUndefined();
    });

    it('should reject whitespace-only query', async () => {
      const result = await searchPlayersAction('   ');

      expect(result.error).toBe('Enter a name or email to search');
    });

    it('should reject invalid email format', async () => {
      const result = await searchPlayersAction('alex.chen@');

      expect(result.error).toBe('Enter a valid email address');
    });

    it('should return empty results for non-matching query', async () => {
      const result = await searchPlayersAction('NonexistentPlayer12345');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
      expect(result.results?.length).toBe(0);
    });
  });

  describe('Email Search', () => {
    it('should find players by exact email', async () => {
      const result = await searchPlayersAction('alex.chen@example.com');

      expect(result.error).toBeUndefined();
      expect(result.results).toBeDefined();
    });

    it('should validate email format before searching', async () => {
      const result = await searchPlayersAction('invalid-email@');

      expect(result.error).toBe('Enter a valid email address');
    });
  });
});

describe('US007: Player Skill Level Update', () => {
  describe('Normal Flow', () => {
    it('should successfully update skill level to Intermediate', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', 'INTERMEDIATE');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Profile updated successfully.');
    });

    it('should successfully update skill level to Advanced', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', 'ADVANCED');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Profile updated successfully.');
    });

    it('should successfully update skill level to Beginner', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', 'BEGINNER');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Profile updated successfully.');
    });
  });

  describe('Alternate Flow', () => {
    it('should allow updating skill level multiple times', async () => {
      const formData1 = new FormData();
      formData1.append('userId', 'player-2');
      formData1.append('skillLevel', 'BEGINNER');

      const result1 = await updateSkillLevelAction(formData1);
      expect(result1.error).toBeUndefined();

      const formData2 = new FormData();
      formData2.append('userId', 'player-2');
      formData2.append('skillLevel', 'ADVANCED');

      const result2 = await updateSkillLevelAction(formData2);
      expect(result2.error).toBeUndefined();
      expect(result2.message).toBe('Profile updated successfully.');
    });
  });

  describe('Error Flows', () => {
    it('should reject empty skill level', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', '');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBe('Please select a valid skill level.');
    });

    it('should reject unsupported skill level', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', 'EXPERT');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBe('Selected skill level is not supported.');
    });

    it('should reject invalid skill level values', async () => {
      const formData = new FormData();
      formData.append('userId', 'player-1');
      formData.append('skillLevel', 'INVALID_LEVEL');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBe('Selected skill level is not supported.');
    });

    it('should reject update for non-existent user', async () => {
      const formData = new FormData();
      formData.append('userId', 'non-existent-user');
      formData.append('skillLevel', 'INTERMEDIATE');

      const result = await updateSkillLevelAction(formData);

      expect(result.error).toBe('User not found.');
    });
  });
});

describe('US008: Availability Management', () => {
  describe('Normal Flow', () => {
    it('should successfully update availability to Available', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', 'game-1');
      formData.append('status', 'Available');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Availability updated successfully');
    });

    it('should successfully update availability to Unavailable', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', 'game-1');
      formData.append('status', 'Unavailable');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Availability updated successfully');
    });

    it('should successfully update availability to Maybe', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', 'game-1');
      formData.append('status', 'Maybe');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Availability updated successfully');
    });
  });

  describe('Error Flows', () => {
    it('should reject invalid availability status', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', 'game-1');
      formData.append('status', 'InvalidStatus');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBe('Invalid availability status.');
    });

    it('should reject missing player ID', async () => {
      const formData = new FormData();
      formData.append('playerId', '');
      formData.append('gameId', 'game-1');
      formData.append('status', 'Available');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBe('Missing required fields.');
    });

    it('should reject missing game ID', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', '');
      formData.append('status', 'Available');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBe('Missing required fields.');
    });

    it('should reject missing status', async () => {
      const formData = new FormData();
      formData.append('playerId', 'player-1');
      formData.append('gameId', 'game-1');
      formData.append('status', '');

      const result = await updateAvailabilityAction(formData);

      expect(result.error).toBe('Missing required fields.');
    });
  });
});
