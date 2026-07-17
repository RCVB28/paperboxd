import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { LoginInput } from "../schemas/login.schema";
import { LoginActionState } from "../types/action-state";

export async function loginUser(data: LoginInput): Promise<LoginActionState> {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  return {
    success: true,
    message: "Login successful.",
  };
}
