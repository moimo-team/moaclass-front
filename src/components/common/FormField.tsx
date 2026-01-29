import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  description?: string;
  required?: boolean;
}

function FormField({ label, htmlFor, children, description, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-lg font-semibold mb-2 block ">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children}

    </div>
  );
}

export default FormField;
