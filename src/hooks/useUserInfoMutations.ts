import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { userInfoUpdate } from "@/api/userInfo.api";

export const useUserUpdateMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: FormData) => {
			return await userInfoUpdate(data);
		},
		onSuccess: () => {
			// users/verify와 통합되었으므로 authUser 쿼리를 invalidate
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("프로필 수정이 완료되었습니다.");
		},
		onError: (error: AxiosError<{ message: string }>) => {
			console.error(error);
			toast.error("프로필 수정에 실패했습니다.");
		},
	});
};
