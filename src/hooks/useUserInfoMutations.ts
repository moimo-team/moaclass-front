import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}