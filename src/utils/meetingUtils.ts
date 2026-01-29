export function isMeetingClosed(
  currentParticipants: number,
  maxParticipants: number,
  meetingDate: string
): boolean {
  const isFull = currentParticipants >= maxParticipants;
  const isPast = new Date(meetingDate) < new Date();
  
  return isFull || isPast;
}
