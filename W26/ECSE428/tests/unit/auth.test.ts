import { describe, it, expect, beforeEach } from 'vitest';
import { registerAction, loginAction, getRegisteredUsers } from '@/app/actions/auth';

describe('US001: Player Registration and Login', () => {
  beforeEach(async () => {
    // Reset registered users by importing fresh
    const users = await getRegisteredUsers();
    users.length = 0;
  });

  describe('Registration - Normal Flow', () => {
    it('should successfully register a player with valid McGill email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass1!');
      formData.append('confirmPassword', 'SecurePass1!');
      formData.append('studentId', '260123456');

      const result = await registerAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toBe('Registration successful. Welcome, John!');
    });

    it('should assign Player role by default on registration', async () => {
      const formData = new FormData();
      formData.append('name', 'Jane Smith');
      formData.append('email', 'jane.smith@mail.mcgill.ca');
      formData.append('password', 'MyPass99$');
      formData.append('confirmPassword', 'MyPass99$');

      await registerAction(formData);
      const users = await getRegisteredUsers();
      const newUser = users.find((u) => u.email === 'jane.smith@mail.mcgill.ca');

      expect(newUser).toBeDefined();
      expect(newUser?.role).toBe('PLAYER');
    });

    it('should successfully register with @mcgill.ca email', async () => {
      const formData = new FormData();
      formData.append('name', 'Alice Brown');
      formData.append('email', 'alice.brown@mcgill.ca');
      formData.append('password', 'AlicePass1!');
      formData.append('confirmPassword', 'AlicePass1!');

      const result = await registerAction(formData);

      expect(result.error).toBeUndefined();
      expect(result.message).toContain('Registration successful');
    });
  });

  describe('Registration - Alternate Flow', () => {
    it('should reject registration with existing email', async () => {
      const formData1 = new FormData();
      formData1.append('name', 'John Doe');
      formData1.append('email', 'john.doe@mail.mcgill.ca');
      formData1.append('password', 'SecurePass1!');
      formData1.append('confirmPassword', 'SecurePass1!');

      await registerAction(formData1);

      const formData2 = new FormData();
      formData2.append('name', 'John Doe');
      formData2.append('email', 'john.doe@mail.mcgill.ca');
      formData2.append('password', 'AnotherPass1!');
      formData2.append('confirmPassword', 'AnotherPass1!');

      const result = await registerAction(formData2);

      expect(result.error).toBe('An account with this email already exists.');
      expect(result.message).toBeUndefined();
    });
  });

  describe('Registration - Error Flows', () => {
    it('should reject non-McGill email addresses', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@gmail.com');
      formData.append('password', 'SecurePass1!');
      formData.append('confirmPassword', 'SecurePass1!');

      const result = await registerAction(formData);

      expect(result.error).toBe('A valid McGill email address is required.');
    });

    it('should reject weak password (too short)', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', '123');
      formData.append('confirmPassword', '123');

      const result = await registerAction(formData);

      expect(result.error).toBe(
        'Password must be at least 8 characters and include a number and a special character.'
      );
    });

    it('should reject password without number', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass!');
      formData.append('confirmPassword', 'SecurePass!');

      const result = await registerAction(formData);

      expect(result.error).toBe(
        'Password must be at least 8 characters and include a number and a special character.'
      );
    });

    it('should reject password without special character', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass1');
      formData.append('confirmPassword', 'SecurePass1');

      const result = await registerAction(formData);

      expect(result.error).toBe(
        'Password must be at least 8 characters and include a number and a special character.'
      );
    });

    it('should reject empty name field', async () => {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass1!');
      formData.append('confirmPassword', 'SecurePass1!');

      const result = await registerAction(formData);

      expect(result.error).toBe('Full name is required.');
    });

    it('should reject whitespace-only name', async () => {
      const formData = new FormData();
      formData.append('name', '   ');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass1!');
      formData.append('confirmPassword', 'SecurePass1!');

      const result = await registerAction(formData);

      expect(result.error).toBe('Full name is required.');
    });

    it('should reject mismatched passwords', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john.doe@mail.mcgill.ca');
      formData.append('password', 'SecurePass1!');
      formData.append('confirmPassword', 'DifferentPass1!');

      const result = await registerAction(formData);

      expect(result.error).toBe('Passwords do not match.');
    });
  });

  describe('Login - Normal Flow', () => {
    it('should successfully login with valid credentials', async () => {
      const registerData = new FormData();
      registerData.append('name', 'John Doe');
      registerData.append('email', 'john.doe@mail.mcgill.ca');
      registerData.append('password', 'SecurePass1!');
      registerData.append('confirmPassword', 'SecurePass1!');

      await registerAction(registerData);

      const loginData = new FormData();
      loginData.append('email', 'john.doe@mail.mcgill.ca');
      loginData.append('password', 'SecurePass1!');

      const result = await loginAction(loginData);

      expect(result.error).toBeUndefined();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('john.doe@mail.mcgill.ca');
      expect(result.user?.name).toBe('John Doe');
    });
  });

  describe('Login - Error Flows', () => {
    it('should reject login with invalid email', async () => {
      const formData = new FormData();
      formData.append('email', 'nonexistent@mail.mcgill.ca');
      formData.append('password', 'AnyPassword1!');

      const result = await loginAction(formData);

      expect(result.error).toBe('Invalid email or password.');
      expect(result.user).toBeUndefined();
    });

    it('should reject login with invalid password', async () => {
      const registerData = new FormData();
      registerData.append('name', 'John Doe');
      registerData.append('email', 'john.doe@mail.mcgill.ca');
      registerData.append('password', 'SecurePass1!');
      registerData.append('confirmPassword', 'SecurePass1!');

      await registerAction(registerData);

      const loginData = new FormData();
      loginData.append('email', 'john.doe@mail.mcgill.ca');
      loginData.append('password', 'WrongPassword1!');

      const result = await loginAction(loginData);

      expect(result.error).toBe('Invalid email or password.');
      expect(result.user).toBeUndefined();
    });

    it('should reject login with missing credentials', async () => {
      const formData = new FormData();
      formData.append('email', '');
      formData.append('password', '');

      const result = await loginAction(formData);

      expect(result.error).toBe('Email and password are required.');
    });
  });
});
