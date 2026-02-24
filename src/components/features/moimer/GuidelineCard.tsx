import { Card } from '@/components/ui/card';

interface GuidelineCardProps {
	title: string;
	description: string;
}

function GuidelineCard({ title, description }: GuidelineCardProps) {
	return (
		<Card className="p-6 border-2 border-primary/20 bg-accent/40 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
			<h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
				{title}
			</h3>
			<p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
				{description}
			</p>
		</Card>
	);
}

export default GuidelineCard;
