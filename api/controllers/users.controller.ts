import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendPasswordSetConfirmation, sendWelcomeEmail } from "../utils/email";

 //login user and check if password is set
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.passwordSet) {
    return res.json({ requiresPasswordSetup: true });
  }

  const valid = await bcrypt.compare(password, user.passwordHash!);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      lastActivity: new Date(),
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role, sessionId: session.id },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );

  res.json({ token, role: user.role });
};

//set password for user
export const setAdminPassword = async (req: Request, res: Response) => {
  const { password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: req.user?.userId },
    data: {
      passwordHash: hash,
      passwordSet: true,
    },
  });

  res.sendStatus(204);
};

// ADMIN to create user
export const createUser = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  //require email from user to send password set email
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  //check if user is already in the database by name
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }
  //create user
  const user = await prisma.user.create({
    data: {
      email,
      role: role || "USER",
      passwordHash: null,
      passwordSet: false,
    },
    select: {
      id: true,
      email: true,
      role: true,
      passwordSet: true,
      createdAt: true,
    },
  });

  try {
    const emailSent = await sendWelcomeEmail(user.email);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send welcome email" });
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return res.status(500).json({ message: "Failed to send welcome email" });
  }

  res.status(201).json(user);
};
//user set password
export const setPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  // Validate inputs
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Validate password strength
  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.passwordHash) {
    return res.status(400).json({
      message: "Password already set. Please use login or reset password.",
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user with new password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      passwordSet: true,
    },
  });

  // Send confirmation email
  try {
    await sendPasswordSetConfirmation(user.email);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }

  res.json({ message: "Password set successfully. You can now login." });
};

//ADMIN to getUsers
export const getUsers = async (req: Request, res: Response) => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      passwordSet: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

//ADMIN to disable users (a soft delete)
export const deactivateUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
    },
  });
};
