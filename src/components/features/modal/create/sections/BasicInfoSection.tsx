import { useFormContext } from 'react-hook-form';

import { FormInput } from '@/components/features/modal/components/FormInput';
import { FormTextarea } from '@/components/features/modal/components/FormTextarea';

import type { ClassFormValues } from '../classSchema';

export function BasicInfoSection() {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const titleLength = watch('title')?.length ?? 0;
	const descriptionLength = watch('description')?.length ?? 0;

	return (
		<>
			<FormInput
				id="title"
				label="클래스명"
				register={register('title')}
				placeholder="매력적인 클래스명을 입력하세요 (100자 이내)"
				maxLength={100}
				currentLength={titleLength}
				error={errors.title?.message}
				required
				labelClassName="text-lg"
			/>

			<FormTextarea
				id="description"
				label="클래스 소개"
				register={register('description')}
				placeholder="클래스에 대해 자유롭게 설명해주세요 (4000자 이내)"
				maxLength={4000}
				currentLength={descriptionLength}
				error={errors.description?.message}
				className="min-h-[120px]"
				required
				labelClassName="text-lg"
			/>
		</>
	);
}
