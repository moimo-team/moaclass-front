import FormField from '@components/common/FormField';
import { Controller, useFormContext } from 'react-hook-form';

import { FormTextarea } from '@/components/features/modal/components/FormTextarea';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

import { LEVEL_OPTIONS } from '../classSchema';

import type { ClassFormValues } from '../classSchema';

export function CurriculumSection() {
	const {
		register,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const selectedLevel = watch('level');
	const duration = watch('duration');

	return (
		<>
			{/* 커리큘럼 */}
			<FormTextarea
				id="curriculum"
				label="커리큘럼"
				register={register('curriculum')}
				placeholder="클래스에서 배울 내용을 구체적으로 작성해주세요 (40~600자)"
				maxLength={600}
				minLength={40}
				currentLength={watch('curriculum')?.length || 0}
				error={errors.curriculum?.message}
				className="min-h-[120px]"
				required
			/>

			{/* 난이도 */}
			<FormField label="난이도" description="클래스의 난이도를 선택해주세요" required>
				<div className="grid grid-cols-3 gap-3">
					{LEVEL_OPTIONS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() =>
								setValue('level', option.value, { shouldValidate: true })
							}
							className={cn(
								'p-4 rounded-lg border-2 transition-all text-left',
								selectedLevel === option.value
									? 'border-primary bg-primary/5'
									: 'border-gray-200 hover:border-gray-300',
							)}
						>
							<div className="font-bold text-sm">{option.label}</div>
							<div className="text-xs text-gray-500 mt-1">{option.description}</div>
						</button>
					))}
				</div>
				{errors.level && (
					<p className="text-xs text-red-500 mt-1">{errors.level.message}</p>
				)}
			</FormField>

			{/* 소요 시간 */}
			<FormField
				label="소요 시간"
				description={`${duration}분 (${Math.floor(duration / 60)}시간 ${duration % 60}분)`}
				required
			>
				<Controller
					name="duration"
					control={control}
					render={({ field }) => (
						<Slider
							min={30}
							max={480}
							step={30}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.duration && (
					<p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
				)}
			</FormField>
		</>
	);
}
