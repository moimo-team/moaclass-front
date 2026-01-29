import { Card } from "@/components/ui/card";

interface FAQCardProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQCard({ question, answer, isOpen, onToggle }: FAQCardProps) {
  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-md transition-shadow self-start"
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Q. {question}
          </h3>
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}
            `}
          >
            <p className="border-t border-border pt-3">
              A. {answer}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FAQCard;