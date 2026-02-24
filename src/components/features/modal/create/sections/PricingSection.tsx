import { useEffect } from 'react';

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
		setValue,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const price = watch('price');
	const discountRate = watch('discountRate');
	const maxParticipants = watch('maxParticipants');
	const reservationLeadDays = watch('reservationLeadDays');

	const priceValue = Number(price) || 0;
	const discountRateValue = Number(discountRate) || 0;
	const discountedPrice = Math.round(priceValue * (1 - discountRateValue / 100));

	useEffect(() => {
		if (priceValue <= 0) {
			setValue('discountRate', 0);
		} else if (discountRateValue > 99) {
			setValue('discountRate', 99);
		}
	}, [priceValue, discountRateValue, setValue]);

	const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (['e', 'E', '+', '-', '.'].includes(e.key)) {
			e.preventDefault();
		}
	};

	const handleNumericChange =
		(name: 'price' | 'discountRate', max?: number) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			// 선행 0 제거 (단, '0' 하나만 있는 경우는 제외)
			let normalized = val.replace(/^0+/, '');
			if (normalized === '') normalized = '0';

			let numValue = Number(normalized);
			if (max !== undefined && numValue > max) {
				numValue = max;
			}

			setValue(name, numValue);
		};

	return (
		<>
			{/* 가격 및 할인 */}
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-4">
					<FormInput
						id="price"
						label="가격"
						register={register('price', { valueAsNumber: true })}
						value={priceValue}
						type="number"
						placeholder="0"
						suffix="원"
						error={errors.price?.message}
						required
						labelClassName="text-lg"
						onFocus={(e) => e.target.select()}
						onKeyDown={handleNumericKeyDown}
						onChange={handleNumericChange('price')}
					/>
					<FormInput
						id="discountRate"
						label="할인율"
						register={register('discountRate', { valueAsNumber: true, max: 99 })}
						value={discountRateValue}
						type="number"
						placeholder={priceValue > 0 ? '0' : '가격을 먼저 입력하세요'}
						suffix="%"
						error={errors.discountRate?.message}
						disabled={priceValue <= 0}
						onFocus={(e) => e.target.select()}
						onKeyDown={handleNumericKeyDown}
						onChange={handleNumericChange('discountRate', 99)}
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
