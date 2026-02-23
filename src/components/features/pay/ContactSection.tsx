import { useState } from 'react';

import { Pencil } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { PaySectionCard } from './PaySectionCard';

interface ContactSectionProps {
	user: {
		email: string;
		nickname: string;
	};
	onEmailChange: (email: string) => void;
}

export const ContactSection = ({ user, onEmailChange }: ContactSectionProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const handleEditToggle = () => {
		setIsEditing(true);
	};

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onEmailChange(e.target.value);
	};

	return (
		<PaySectionCard title="연락처 정보" extra="(이메일 알림 발송)">
			<div className="space-y-4">
				<div className="space-y-2">
					<p className="text-[10px] text-destructive italic font-semibold">
						* 결제한 클래스의 상세 정보는 하단의 이메일로 발송됩니다. <br />* 수신
						가능한 이메일인지 결제 전에 반드시 확인해주시고 아닐 경우 하단의 항목을
						클릭하여 수정 바랍니다.
					</p>
					<label className="text-xs font-semibold text-muted-foreground">이메일</label>
					<div
						className={`group relative h-10 rounded-sm flex items-center px-3 text-sm cursor-pointer transition-colors ${
							isEditing
								? 'bg-background border-2 border-primary ring-2 ring-primary/20'
								: 'bg-muted/30 border border-border/60 hover:bg-muted/50 hover:border-border'
						}`}
						onClick={handleEditToggle}
					>
						{isEditing ? (
							<Input
								value={user.email}
								onChange={handleChange}
								onBlur={handleBlur}
								autoFocus
								className="h-8 border-none bg-transparent p-0 focus-visible:ring-0"
							/>
						) : (
							<div className="flex items-center justify-between w-full">
								<span>{user.email}</span>
								<Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						)}
					</div>
				</div>
				<div className="space-y-2">
					<label className="text-xs font-semibold text-muted-foreground">
						이름(닉네임)
					</label>
					<div className="bg-muted/30 border-border/60 h-10 rounded-sm flex items-center px-3 text-sm">
						{user.nickname}
					</div>
				</div>
			</div>
		</PaySectionCard>
	);
};
