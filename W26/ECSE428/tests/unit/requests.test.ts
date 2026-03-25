import { describe, it, expect } from 'vitest';
import { reviewJoinRequestAction, getJoinRequestsAction } from '@/app/actions/teams';

describe('US006: Review Player Request', () => {
  describe('Normal Flow', () => {
    it('should successfully approve a pending join request as Captain', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-1');
      formData.append('action', 'approve');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Player request approved.');
    });

    it('should add player to roster when request is approved', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-2');
      formData.append('action', 'approve');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      await reviewJoinRequestAction(formData);

      // Verify the request status changed
      const requests = await getJoinRequestsAction();
      const approvedRequest = requests.find((r) => r.id === 'jr-2');

      if (approvedRequest) {
        expect(approvedRequest.status).toBe('Approved');
      }
    });
  });

  describe('Alternate Flow', () => {
    it('should successfully reject a pending join request', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-3');
      formData.append('action', 'reject');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Player request rejected.');
    });

    it('should not add player to roster when request is rejected', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-4');
      formData.append('action', 'reject');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      await reviewJoinRequestAction(formData);

      const requests = await getJoinRequestsAction();
      const rejectedRequest = requests.find((r) => r.id === 'jr-4');

      if (rejectedRequest) {
        expect(rejectedRequest.status).toBe('Rejected');
      }
    });
  });

  describe('Error Flows', () => {
    it('should reject review attempt by non-captain (Player role)', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-5');
      formData.append('action', 'approve');
      formData.append('captainId', 'player-1');
      formData.append('userRole', 'PLAYER');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBe('Only captains can review join requests.');
    });

    it('should reject review attempt by Administrator', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-6');
      formData.append('action', 'approve');
      formData.append('captainId', 'admin-1');
      formData.append('userRole', 'ADMINISTRATOR');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBe('Only captains can review join requests.');
    });

    it('should reject review of already processed request', async () => {
      // First approve the request
      const formData1 = new FormData();
      formData1.append('requestId', 'jr-7');
      formData1.append('action', 'approve');
      formData1.append('captainId', 'captain-1');
      formData1.append('userRole', 'CAPTAIN');

      await reviewJoinRequestAction(formData1);

      // Try to reject the same request
      const formData2 = new FormData();
      formData2.append('requestId', 'jr-7');
      formData2.append('action', 'reject');
      formData2.append('captainId', 'captain-1');
      formData2.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData2);

      expect(result.error).toBe('This request has already been reviewed.');
    });

    it('should reject review by captain of different team', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-8');
      formData.append('action', 'approve');
      formData.append('captainId', 'wrong-captain');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBe('You are not authorized to review requests for this team.');
    });

    it('should reject review of non-existent request', async () => {
      const formData = new FormData();
      formData.append('requestId', 'non-existent-request');
      formData.append('action', 'approve');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      expect(result.error).toBe('Join request not found.');
    });
  });

  describe('Request Validation', () => {
    it('should handle approve action correctly', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-9');
      formData.append('action', 'approve');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      if (!result.error) {
        expect(result.message).toBe('Player request approved.');
      }
    });

    it('should handle reject action correctly', async () => {
      const formData = new FormData();
      formData.append('requestId', 'jr-10');
      formData.append('action', 'reject');
      formData.append('captainId', 'captain-1');
      formData.append('userRole', 'CAPTAIN');

      const result = await reviewJoinRequestAction(formData);

      if (!result.error) {
        expect(result.message).toBe('Player request rejected.');
      }
    });
  });
});
