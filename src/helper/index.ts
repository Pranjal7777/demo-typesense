export const getFormattedRating = (rating: number | string | undefined | null) => {
  if (!rating) return '0';
  const ratingNumber = Number(rating);
  if (ratingNumber < 1) return '0';
  return ratingNumber.toFixed(1);
};

