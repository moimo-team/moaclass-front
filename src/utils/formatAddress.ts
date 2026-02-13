// 주소에서 표시할 부분을 추출하는 함수
export const getDisplayAddress = (fullAddress: string): string => {
	if (!fullAddress) return '';

	const parts = fullAddress.split(' ');
	let firstLevel = ''; // ex) 서울특별시, 경기도
	let secondLevel = ''; // ex) 강남구, 가평군

	// 1. 시/도
	for (const part of parts) {
		if (
			part.endsWith('특별시') ||
			part.endsWith('광역시') ||
			part.endsWith('특별자치시') ||
			part.endsWith('도') ||
			part.endsWith('시')
		) {
			firstLevel = part;
		}
	}

	// 2. 구/군
	const firstLevelIndex = firstLevel ? parts.indexOf(firstLevel) : -1;
	const startIndexForSecondLevel = firstLevelIndex !== -1 ? firstLevelIndex + 1 : 0;

	for (let i = startIndexForSecondLevel; i < parts.length; i++) {
		const part = parts[i];
		if (part.endsWith('구') || part.endsWith('군')) {
			secondLevel = part;
			break;
		}
	}

	// 3. 결합 후 return
	if (firstLevel && secondLevel) {
		return `${firstLevel} ${secondLevel}`;
	} else if (firstLevel) {
		return firstLevel;
	} else if (secondLevel) {
		// 만약 주소가 '구'나 '군'으로 바로 시작하는 경우
		return secondLevel;
	} else {
		return parts[0] || ''; // 일치하는 부분이 없으면 첫 번째 단어 반환
	}
};
