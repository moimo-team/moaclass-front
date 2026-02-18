import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { VerifyUserResponse } from '@/api/auth.api';
import { chargePoint } from '@/api/point.api';
import type { PointHistory, PointResponse } from '@/models/point.model';
import { useAuthStore } from '@/store/authStore';

// 포인트 충전
export const useChargePointMutation = () => {
	const { userId } = useAuthStore();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (amount: number) => chargePoint(amount),
		onSuccess: (data, variables) => {
			// 1. 유저 정보 캐시 직접 수정 (현재 포인트 업데이트)
			queryClient.setQueryData<VerifyUserResponse | null>(['authUser'], (oldUser) => {
				if (!oldUser) return oldUser;
				return {
					...oldUser,
					point: data.userPoints,
				};
			});

			// 2. 포인트 내역 캐시 직접 수정 (새로운 내역 추가 및 포인트 업데이트)
			queryClient.setQueryData<PointResponse | undefined>(
				['points', 'me', userId],
				(oldPoints) => {
					if (!oldPoints) return oldPoints;

					const newHistoryEntry: PointHistory = {
						transactionId: data.transaction.id,
						lessonName: '포인트 충전',
						type: data.transaction.type,
						status: data.transaction.status,
						amount: data.transaction.amount,
						coupon: null,
						createdAt: data.transaction.createdAt,
					};

					return {
						...oldPoints,
						userPoints: data.userPoints,
						history: [newHistoryEntry, ...oldPoints.history],
					};
				},
			);

			toast.success(`${variables.toLocaleString()}포인트가 충전되었습니다.`);
		},
	});
};
