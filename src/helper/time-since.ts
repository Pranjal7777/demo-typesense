export function timeSince(timestamp: number): string {
  const now = new Date();
  const postDate = new Date(timestamp * 1000);
  const secondsPast = (now.getTime() - postDate.getTime()) / 1000;
  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`;
  } else if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`;
  } else if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`;
  } else {
    const daysPast = secondsPast / 86400;
    if (daysPast < 7) {
      return `${Math.floor(daysPast)} days ago`;
    }
    const weeksPast = daysPast / 7;
    if (weeksPast < 4) {
      return `${Math.floor(weeksPast)} weeks ago`;
    }
    const monthsPast = daysPast / 30;
    if (monthsPast < 12) {
      return `${Math.floor(monthsPast)} months ago`;
    }
    const yearsPast = daysPast / 365;
    return `${Math.floor(yearsPast)} years ago`;
  }
}
