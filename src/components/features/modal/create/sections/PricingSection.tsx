import FormField from '@components/common/FormField';
import { Controller, useFormContext } from 'react-hook-form';

import { FormInput } from '@/components/features/modal/components/FormInput';
import { Slider } from '@/components/ui/slider';

import type { ClassFormValues } from '../classSchema';

export function PricingSection() {
	const {
		register,
		watch,
		control,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const price = watch('price');
	const discountRate = watch('discountRate');
	const maxParticipants = watch('maxParticipants');
	const reservationLeadDays = watch('reservationLeadDays');

	const priceValue = Number(price) || 0;
	const discountRateValue = Number(discountRate) || 0;
	const discountedPrice = Math.round(priceValue * (1 - discountRateValue / 100));

	return (
		<>
			{/* 가격 및 할인 */}
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-4">
					<FormInput
						id="price"
						label="가격"
						register={register('price', { valueAsNumber: true })}
						type="number"
						placeholder="0"
						suffix="원"
						error={errors.price?.message}
						required
						onFocus={(e) => e.target.select()}
					/>
					<FormInput
						id="discountRate"
						label="할인율"
						register={register('discountRate', { valueAsNumber: true })}
						type="number"
						placeholder="0"
						suffix="%"
						error={errors.discountRate?.message}
						onFocus={(e) => e.target.select()}
					/>
				</div>

				{/* 최종 판매가 */}
				{priceValue > 0 && (
					<div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex justify-between items-center">
						<span className="text-sm text-gray-600 font-medium">최종 판매가</span>
						<div className="text-right">
							{discountRateValue > 0 && (
								<p className="text-xs text-gray-400 line-through mb-0.5">
									{priceValue.toLocaleString()}원
								</p>
							)}
							<p className="text-lg font-bold text-primary">
								{discountedPrice.toLocaleString()}원
							</p>
						</div>
					</div>
				)}
			</div>

			{/* 최대 인원 */}
			<FormField label="최대 인원" description={`최대 ${maxParticipants}명`} required>
				<Controller
					name="maxParticipants"
					control={control}
					render={({ field }) => (
						<Slider
							min={1}
							max={50}
							step={1}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.maxParticipants && (
					<p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>
				)}
			</FormField>

			{/* 예약 가능 기간 */}
			<FormField
				label="예약 가능 기간"
				description={
					reservationLeadDays === 0
						? '당일 예약 가능'
						: `${reservationLeadDays}일 전부터 예약 가능`
				}
				required
			>
				<Controller
					name="reservationLeadDays"
					control={control}
					render={({ field }) => (
						<Slider
							min={0}
							max={10}
							step={1}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.reservationLeadDays && (
					<p className="text-xs text-red-500 mt-1">
						{errors.reservationLeadDays.message}
					</p>
				)}
			</FormField>
		</>
	);
}
