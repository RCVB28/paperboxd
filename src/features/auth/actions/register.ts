"use server";

import { RegisterSchema } from "../schemas/register.schema";
import { registerUser } from "../services/register.service";
import { RegisterActionState } from "../types/action-state";

export async function register(
  previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const values = Object.fromEntries(formData.entries());

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await registerUser(validatedFields.data);

  return result;
}
