import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PaySectionCardProps {
	title: string;
	extra?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export const PaySectionCard = ({ title, extra, children, className }: PaySectionCardProps) => {
	return (
		<Card className={cn('overflow-hidden border-border/50 shadow-sm', className)}>
			<CardHeader className="bg-accent/40 py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
				<CardTitle className="text-base font-bold text-primary">{title}</CardTitle>
				{extra && <div className="text-xs text-muted-foreground">{extra}</div>}
			</CardHeader>
			<CardContent className="p-4">{children}</CardContent>
		</Card>
	);
};
