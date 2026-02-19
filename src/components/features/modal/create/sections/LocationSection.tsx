import FormField from '@components/common/FormField';
import { Controller, useFormContext } from 'react-hook-form';

import { RegionSelect } from '@/components/common/RegionSelect';
import KakaoMapSearch from '@/components/features/map/kakaoMaps/KakaoMapSearch';
import { FormInput } from '@/components/features/modal/components/FormInput';
import { FormTextarea } from '@/components/features/modal/components/FormTextarea';
import type { PlaceInfo } from '@/models/kakao-maps.model';

import type { ClassFormValues } from '../classSchema';

export function LocationSection() {
	const {
		register,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const handlePlaceSelect = (place: PlaceInfo) => {
		setValue('address', place.roadAddress || place.address, { shouldValidate: true });
		setValue('latitude', place.lat, { shouldValidate: true });
		setValue('longitude', place.lng, { shouldValidate: true });
	};

	return (
		<>
			{/* 지역 선택 */}
			<FormField label="지역" description="클래스가 진행될 지역을 선택해주세요" required>
				<Controller
					name="regionId"
					control={control}
					render={({ field }) => (
						<RegionSelect value={field.value} onValueChange={field.onChange} />
					)}
				/>
				{errors.regionId && (
					<p className="text-xs text-red-500 mt-1">{errors.regionId.message}</p>
				)}
			</FormField>

			{/* 카카오맵 장소 검색 */}
			<FormField label="장소" description="카카오맵에서 장소를 검색하여 선택해주세요">
				<KakaoMapSearch onPlaceSelect={handlePlaceSelect} defaultValue={watch('address')} />
				{errors.address && (
					<p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
				)}
			</FormField>

			{/* 상세 주소 */}
			<FormInput
				id="detailAddress"
				label="상세 주소"
				register={register('detailAddress')}
				placeholder="상세 주소를 입력하세요 (선택)"
				error={errors.detailAddress?.message}
			/>

			{/* 찾아오는 길 */}
			<FormTextarea
				id="directionsText"
				label="찾아오는 길"
				register={register('directionsText')}
				placeholder="클래스 장소를 찾아오는 방법을 설명해주세요 (선택)"
				error={errors.directionsText?.message}
				className="min-h-[80px]"
			/>
		</>
	);
}
