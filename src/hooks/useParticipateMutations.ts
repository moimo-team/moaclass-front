import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
    approveParticipation,
    rejectParticipation,
    approveAllParticipations,
    cancelApprovalParticipation,
    cancelRejectParticipation
} from "@/api/participation.api";

// 개별 승인 Mutation
export const useApproveParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }>({
        mutationFn: ({ meetingId, participationId }) =>
            approveParticipation(meetingId, participationId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participations", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });
        },

        onSettled: (_, __, { meetingId }) => {
            queryClient.invalidateQueries({ queryKey: ["participations", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["participants", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};

// 개별 거절 Mutation
export const useRejectParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }>({
        mutationFn: ({ meetingId, participationId }) =>
            rejectParticipation(meetingId, participationId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participations", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });
        },

        onSettled: (_, __, { meetingId }) => {
            queryClient.invalidateQueries({ queryKey: ["participations", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["participants", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};

// 전체 승인 Mutation
export const useApproveAllParticipations = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number }>({
        mutationFn: ({ meetingId }) => approveAllParticipations(meetingId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participations", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });
        },

        onSettled: (_, __, { meetingId }) => {
            queryClient.invalidateQueries({ queryKey: ["participations", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["participants", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};

// 승인 취소 Mutation
export const useCancelApprovalParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }>({
        mutationFn: ({ meetingId, participationId }) =>
            cancelApprovalParticipation(meetingId, participationId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participations", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });
        },

        onSettled: (_, __, { meetingId }) => {
            queryClient.invalidateQueries({ queryKey: ["participations", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["participants", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};

// 거절 취소 Mutation
export const useCancelRejectParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }>({
        mutationFn: ({ meetingId, participationId }) =>
            cancelRejectParticipation(meetingId, participationId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participations", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });
        },

        onSettled: (_, __, { meetingId }) => {
            queryClient.invalidateQueries({ queryKey: ["participations", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["participants", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};