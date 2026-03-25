"use server";

import { MOCK_USERS, type MockUser } from "@/lib/mock-auth";

// In-memory store for registered users (MVP)
const registeredUsers: MockUser[] = [...MOCK_USERS];

export async function loginAction(
  formData: FormData
): Promise<{ error?: string; user?: MockUser }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = registeredUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { error: "Invalid email or password." };
  }

  // In production, this would set a session cookie
  return { user };
}

export async function registerAction(
  formData: FormData
): Promise<{ error?: string; message?: string }> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const studentId = (formData.get("studentId") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate name
  if (!name) {
    return { error: "Full name is required." };
  }

  // Validate email
  if (!email) {
    return { error: "Email is required." };
  }

  if (
    !email.endsWith("@mail.mcgill.ca") &&
    !email.endsWith("@mcgill.ca")
  ) {
    return { error: "A valid McGill email address is required." };
  }

  // Check for existing user
  if (registeredUsers.find((u) => u.email === email)) {
    return { error: "An account with this email already exists." };
  }

  // Validate password
  if (!password || password.length < 8) {
    return {
      error:
        "Password must be at least 8 characters and include a number and a special character.",
    };
  }

  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  if (!hasNumber || !hasSpecial) {
    return {
      error:
        "Password must be at least 8 characters and include a number and a special character.",
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // Create user
  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    studentId: studentId || undefined,
    role: "PLAYER",
    skillLevel: "BEGINNER",
    reliabilityScore: 100,
    isActive: true,
  };

  registeredUsers.push(newUser);

  const firstName = name.split(" ")[0];
  return {
    message: `Registration successful. Welcome, ${firstName}!`,
  };
}

export async function getRegisteredUsers(): Promise<MockUser[]> {
  return registeredUsers;
}
