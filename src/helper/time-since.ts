export function timeSince(timestamp: number): string {
  const now = new Date();
  const postDate = new Date(timestamp * 1000);
  const secondsPast = (now.getTime() - postDate.getTime()) / 1000;

  if (secondsPast < 60) {
    const seconds = Math.floor(secondsPast);
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const daysPast = secondsPast / 86400;

    if (daysPast < 7) {
      const days = Math.floor(daysPast);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    const weeksPast = daysPast / 7;
    if (weeksPast < 4) {
      const weeks = Math.floor(weeksPast);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }

    const monthsPast = daysPast / 30;
    if (monthsPast < 12) {
      const months = Math.floor(monthsPast);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    const yearsPast = daysPast / 365;
    const years = Math.floor(yearsPast);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}
