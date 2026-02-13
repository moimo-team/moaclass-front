import { useNavigate, useParams } from "react-router-dom";
import { OrderClassInfo } from "@/components/features/orderlist/orderDetail/OrderClassInfo";
import ActionButton from "@/components/common/ActionButton";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { RefundRuleSection } from "@/components/features/pay/RefundRuleSection";
import { CANCEL_REASONS } from "@/constants/cancelReasons";
import { useCancelClassQuery } from "@/hooks/useOrderlistQuery";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormTextarea } from "@/components/features/modal/components/FormTextarea";
import FormField from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { useCancelClassMutation } from "@/hooks/useOrderMutations";

const cancelSchema = z.object({
	reason: z.enum(CANCEL_REASONS as [string, ...string[]]),
	detailReason: z
		.string()
		.min(10, { message: '최소 10자 이상 입력해 주세요.' })
		.max(500, { message: '최대 500자까지 입력 가능합니다.' }),
	isAgreed: z.boolean().refine((val) => val === true, {
		message: '환불 규정에 동의해야 합니다.',
	}),
});

export type CancelFormValues = z.infer<typeof cancelSchema>;

const CancelClass = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const { data: cancelClassInfo, isLoading } = useCancelClassQuery(
    Number(enrollmentId),
  );
  const { mutateAsync: cancelClass } = useCancelClassMutation();

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors, isValid },
	} = useForm<CancelFormValues>({
		resolver: zodResolver(cancelSchema),
		defaultValues: {
			reason: CANCEL_REASONS[0],
			detailReason: '',
			isAgreed: false,
		},
		mode: 'onChange',
	});

	const watchDetailReason = watch('detailReason');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!cancelClassInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">해당 주문 내역을 찾을 수 없습니다.</p>
        <ActionButton
          label="목록으로 돌아가기"
          onClick={() => navigate("/mypage/class/orders")}
        />
      </div>
    );
  }

  // 수강 취소 핸들러
  const onSubmit = async (data: CancelFormValues) => {
    await cancelClass({
      enrollmentId: Number(enrollmentId),
      data,
    });
  };

	return (
		<div className="max-w-3xl mx-auto w-full pb-20 bg-white min-h-screen font-nanum">
			{/* Header */}
			<header className="flex items-center p-4 border-b border-gray-100">
				<button
					onClick={() => navigate(-1)}
					className="mr-2 hover:bg-gray-50 p-1 rounded-full transition-colors"
				>
					<ChevronLeft className="w-6 h-6 text-gray-600" />
				</button>
				<h1 className="text-2xl font-bold text-[#2D3A3A]">수강 취소</h1>
			</header>

      <div className="p-5 space-y-8">
        {/* Class Info Section */}
        <section>
          <FormField label="클래스 정보">
            <OrderClassInfo
              title={cancelClassInfo.classInfo.title}
              teacherName={cancelClassInfo.classInfo.teacherName}
              price={cancelClassInfo.paymentInfo.originPrice}
            />
          </FormField>
        </section>

				{/* Refund Reason Section */}
				<section className="space-y-4">
					<FormField label="환불 사유" required>
						<div className="space-y-3 pt-2">
							<Controller
								name="reason"
								control={control}
								render={({ field }) => (
									<>
										{CANCEL_REASONS.map((r) => (
											<div
												key={r}
												className="flex items-center gap-3 cursor-pointer group"
												onClick={() => field.onChange(r)}
											>
												<div className="relative flex items-center justify-center">
													{field.value === r ? (
														<div className="w-5 h-5 rounded-full border-2 border-destructive flex items-center justify-center">
															<div className="w-2.5 h-2.5 rounded-full bg-destructive" />
														</div>
													) : (
														<div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />
													)}
												</div>
												<span
													className={
														field.value === r
															? 'text-gray-900 font-medium'
															: 'text-gray-600'
													}
												>
													{r}
												</span>
											</div>
										))}
									</>
								)}
							/>
						</div>
					</FormField>
				</section>

				{/* Detailed Reason Section */}
				<section>
					<FormTextarea
						id="detailReason"
						label="상세 사유"
						required
						placeholder="환불 사유를 입력해 주세요. (예시: 콘텐츠가 생각한 것과 달라요.)"
						register={register('detailReason')}
						maxLength={500}
						minLength={10}
						currentLength={watchDetailReason.length}
						error={errors.detailReason?.message}
						className="min-h-[120px]"
					/>
				</section>

				<Separator className="bg-gray-100" />

        {/* Refund Guide Section */}
        <section className="space-y-6">
          <FormField label="환불 안내">
            {/* Payment Info */}
            <div className="space-y-3 p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">결제 금액</span>
                <span className="font-bold text-gray-900">
                  {cancelClassInfo.paymentInfo.finalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="pl-4 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>ㄴ 상품 금액</span>
                  <span>
                    {cancelClassInfo.paymentInfo.originPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ㄴ 쿠폰 할인</span>
                  <span>
                    -
                    {cancelClassInfo.paymentInfo.discountAmount.toLocaleString()}
                    원
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>ㄴ 실 결제 금액</span>
                  <span>
                    {cancelClassInfo.paymentInfo.finalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-50" />

            {/* Refund Info */}
            <div className="space-y-3 p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">환불 금액</span>
                <span className="font-bold text-gray-900">
                  {cancelClassInfo.refundInfo.refundFinalAmount.toLocaleString()}
                  원
                </span>
              </div>
              <div className="pl-4 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>ㄴ 실 결제 금액</span>
                  <span>
                    {cancelClassInfo.paymentInfo.finalPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ㄴ 환불 차감액</span>
                  <span>
                    -
                    {cancelClassInfo.refundInfo.refundDiscountAmount.toLocaleString()}
                    원
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>ㄴ 실 환불 금액</span>
                  <span>
                    {cancelClassInfo.refundInfo.refundFinalAmount.toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          </FormField>
        </section>

        {/* 환불 규정 */}
        <section className="space-y-4">
          <FormField label="환불 규정">
            <RefundRuleSection />
          </FormField>
        </section>

				{/* Agreement and Submit Section */}
				<section className="space-y-6 pt-4">
					<Controller
						name="isAgreed"
						control={control}
						render={({ field }) => (
							<div className="space-y-2">
								<div
									className="flex items-center gap-2 cursor-pointer group"
									onClick={() => field.onChange(!field.value)}
								>
									<div className="w-5 h-5 flex items-center justify-center">
										{field.value ? (
											<CheckCircle2 className="w-5 h-5 text-gray-900 fill-gray-900 stroke-white" />
										) : (
											<div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-gray-300 transition-colors" />
										)}
									</div>
									<span className="text-sm text-gray-700 font-medium">
										환불 규정에 동의합니다.
									</span>
								</div>
								{errors.isAgreed && (
									<p className="text-xs text-red-500">
										{errors.isAgreed.message}
									</p>
								)}
							</div>
						)}
					/>
					<Button
						variant="carrot"
						size="carrot"
						className="w-full"
						type="button"
						disabled={!isValid}
						onClick={handleSubmit(onSubmit)}
					>
						환불 신청하기
					</Button>
				</section>
			</div>
		</div>
	);
};

export default CancelClass;
