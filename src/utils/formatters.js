export const formatRaceDate = (dateString, includeTime = true) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };
  return date.toLocaleDateString('es-ES', options);
};

export const getTimeRemaining = (targetDateString) => {
  const total = Date.parse(targetDateString) - Date.parse(new Date());
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds, isPast: false };
};
