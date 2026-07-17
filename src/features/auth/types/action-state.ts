export type RegisterActionState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export const initialRegisterActionState: RegisterActionState = {
  success: false,
  message: "",
  errors: {},
};

export type LoginActionState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};
