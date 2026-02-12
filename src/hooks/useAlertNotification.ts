import { useState, useCallback } from 'react';

interface ShowAlertParams {
  title: string;
  description?: string;
}

/**
 * 알림 피드백을 공통으로 관리하는 커스텀 훅
 */
export function useAlertNotification(autoCloseDuration = 2000) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const showAlert = useCallback(
    ({ title, description = '' }: ShowAlertParams) => {
      setAlertTitle(title);
      setAlertDescription(description);
      setIsAlertOpen(true);
    },
    [],
  );

  const alertProps = {
    open: isAlertOpen,
    onOpenChange: setIsAlertOpen,
    title: alertTitle,
    description: alertDescription,
    autoCloseDuration,
  };

  return { showAlert, alertProps };
}
