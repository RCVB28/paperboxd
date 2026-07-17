import { Input, type InputProps } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export interface AuthFieldProps extends InputProps {
  id: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export function AuthField({
  label,
  hint,
  error,
  required,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputProps.id} required={required} hint={hint}>
        {label}
      </Label>

      <Input error={error} {...inputProps} />
    </div>
  );
}
