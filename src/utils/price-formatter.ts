export const formatPrice = (price: number | string): string => {
  // Converting string to number if needed
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Handling invalid input
  if (isNaN(numericPrice)) return 'USD $0.00';
  
  // Formating the price with commas and 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);

  // Added USD prefix
  return `USD ${formattedPrice}`;
};

export const formatPriceWithoutCents = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return 'USD $0';
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);

  // Added USD prefix
  return `USD ${formattedPrice}`;
}; 