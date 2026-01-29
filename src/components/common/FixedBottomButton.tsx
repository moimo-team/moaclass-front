import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FixedBottomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function FixedBottomButton({
  children,
  onClick,
  className,
  disabled
}: FixedBottomButtonProps) {
  return (
    <div className="sticky bottom-0 left-0 w-screen ml-[calc(50%-50vw)] z-50">
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full h-24 rounded-none text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-none border-none transition-all",
          className
        )}
      >
        {children}
      </Button>
    </div>
  );
}

export default FixedBottomButton;
