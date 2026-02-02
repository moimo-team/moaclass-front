import { PaySectionCard } from './PaySectionCard';

interface ContactSectionProps {
    userInfo: {
        email: string;
        nickname: string;
    };
}

export const ContactSection = ({ userInfo }: ContactSectionProps) => {
    return (
        <PaySectionCard title="연락처 정보" extra="(이메일 알림 발송)">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">이메일</label>
                    <p className="text-[10px] text-muted-foreground italic">
                        * 클래스 정보는 가입하신 이메일로 발송됩니다.
                    </p>
                    <div className="bg-muted/30 border-border/60 h-10 rounded-sm flex items-center px-3 text-sm">
                        {userInfo.email}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">이름(닉네임)</label>
                    <div className="bg-muted/30 border-border/60 h-10 rounded-sm flex items-center px-3 text-sm">
                        {userInfo.nickname}
                    </div>
                </div>
            </div>
        </PaySectionCard>
    );
};
