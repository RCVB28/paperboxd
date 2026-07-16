import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { RegisterInput } from "../schemas/register.schema";
import { RegisterActionState } from "../types/action-state";

export async function registerUser(
  data: RegisterInput,
): Promise<RegisterActionState> {
  const { name, email, password } = data;

  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Account created successfully.",
  };
}
