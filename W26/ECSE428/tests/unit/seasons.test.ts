import { describe, it, expect } from 'vitest';
import { createSeasonAction, getSeasonsAction } from '@/app/actions/seasons';

describe('US003: Season Creation', () => {
  describe('Normal Flow', () => {
    it('should successfully create a season with valid details', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '2026-04-15');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Season Winter 2026 created successfully.');
    });

    it('should create season with Active status', async () => {
      const formData = new FormData();
      formData.append('name', 'Fall 2026');
      formData.append('startDate', '2026-09-01');
      formData.append('endDate', '2026-12-10');
      formData.append('userRole', 'ADMINISTRATOR');

      await createSeasonAction(formData);

      const seasons = await getSeasonsAction();
      const newSeason = seasons.find((s) => s.name === 'Fall 2026');

      expect(newSeason).toBeDefined();
      expect(newSeason?.isActive).toBe(true);
    });
  });

  describe('Alternate Flow', () => {
    it('should reject creating a season when another is active', async () => {
      const formData1 = new FormData();
      formData1.append('name', 'Winter 2026');
      formData1.append('startDate', '2026-01-12');
      formData1.append('endDate', '2026-04-15');
      formData1.append('userRole', 'ADMINISTRATOR');

      await createSeasonAction(formData1);

      const formData2 = new FormData();
      formData2.append('name', 'Fall 2026');
      formData2.append('startDate', '2026-09-01');
      formData2.append('endDate', '2026-12-10');
      formData2.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData2);

      expect(result.error).toBe(
        'An active season already exists. Please close it before creating a new one.'
      );
    });
  });

  describe('Error Flows', () => {
    it('should reject season with end date before start date', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-04-15');
      formData.append('endDate', '2026-01-12');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('End date must be after the start date.');
    });

    it('should reject season with same start and end date', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '2026-01-12');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('End date must be after the start date.');
    });

    it('should reject season without a name', async () => {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '2026-04-15');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('Season name is required.');
    });

    it('should reject season creation by non-organizer', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '2026-04-15');
      formData.append('userRole', 'PLAYER');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('Only organizers can manage seasons.');
    });

    it('should reject season creation by Captain', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '2026-04-15');
      formData.append('userRole', 'CAPTAIN');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('Only organizers can manage seasons.');
    });

    it('should reject season without start date', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '');
      formData.append('endDate', '2026-04-15');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('Start and end dates are required.');
    });

    it('should reject season without end date', async () => {
      const formData = new FormData();
      formData.append('name', 'Winter 2026');
      formData.append('startDate', '2026-01-12');
      formData.append('endDate', '');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await createSeasonAction(formData);

      expect(result.error).toBe('Start and end dates are required.');
    });
  });
});
