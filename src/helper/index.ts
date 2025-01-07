import { countries } from "./countries-list";

export const getFormattedRating = (rating: number | string | undefined | null) => {
  if (!rating) return '0';
  const ratingNumber = Number(rating);
  if (ratingNumber < 1) return '0';
  return ratingNumber.toFixed(1);
};

export const getCountryCodeFromName = (countryName: string) => {
  const country = countries.data.find(([name]) => name.toString().toLowerCase() === countryName.toLowerCase());
  if (country) {
    return `+${country[2]}`;
  } else {
    return '+91';
  }
};

