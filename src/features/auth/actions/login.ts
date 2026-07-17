"use server";

import { LoginSchema } from "../schemas/login.schema";
import { loginUser } from "../services/login.service";
import { LoginActionState } from "../types/action-state";

export async function login(
  previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const values = Object.fromEntries(formData.entries());

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await loginUser(validatedFields.data);
}
