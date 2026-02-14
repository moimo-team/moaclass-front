import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonProps {
	label: string;
	icon?: React.ReactNode;
	theme?: 'primary' | 'destructive' | 'outline' | 'yellow' | 'carrot';
}

const ActionButton = ({
	label,
	icon,
	theme = 'primary',
	className,
	disabled,
	...props
}: ActionButtonProps) => {
	const themeStyles = {
		primary: 'border-primary text-gray-900 hover:bg-primary/5',
		destructive: 'border-destructive text-destructive hover:bg-destructive/5',
		outline: 'border-primary/40 text-gray-900 hover:bg-primary/5',
		yellow: 'border-yellow-400 text-gray-900 hover:bg-yellow-50',
		carrot: 'border-carrot text-gray-900 hover:bg-carrot/5',
	};

	return (
		<Button
			variant="outline"
			className={cn(
				'h-10 border-2 shadow-none font-bold gap-2 transition-all text-xs sm:text-[13px]',
				themeStyles[theme],
				disabled && 'opacity-40 cursor-not-allowed grayscale border-gray-300 text-gray-400',
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{icon}
			{label}
		</Button>
	);
};

export default ActionButton;
