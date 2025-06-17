import { cn } from "@/lib/utils";

export const Form = ({
  children,
  action,
  className,
  isDisabled,
}: {
  children: React.ReactNode;
  action: (formData: FormData) => void;
  className?: string;
  isDisabled?: boolean;
}) => {
  return (
    <form
      action={action}
      className={cn(
        isDisabled ? "opacity-50 pointer-events-none" : "",
        className
      )}
    >
      {children}
    </form>
  );
};
