import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FAQCardProps {
	question: string;
	answer: string;
	isOpen: boolean;
	onToggle: () => void;
}

function FAQCard({ question, answer, isOpen, onToggle }: FAQCardProps) {
	return (
		<Card
			className={cn(
				'p-6 cursor-pointer hover:shadow-md transition-all self-start border-l-4',
				isOpen ? 'bg-accent/30 border-primary' : 'border-transparent',
			)}
			onClick={onToggle}
		>
			<div className="flex items-start gap-3">
				<div className="flex-1">
					<h3
						className={cn(
							'text-base font-semibold mb-2 transition-colors',
							isOpen ? 'text-primary' : 'text-foreground',
						)}
					>
						Q. {question}
					</h3>
					<div
						className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}
            `}
					>
						<p className="border-t border-border pt-3 text-muted-foreground leading-relaxed">
							A. {answer}
						</p>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default FAQCard;
