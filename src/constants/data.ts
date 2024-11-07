import {
  BEVERAGE_BOUNTY,
  BIRYANI,
  BOXED_BLISS,
  BREAKFAST,
  BURGER,
  BURGER_BITES,
  BURGER_CRUSH,
  BURRITO_BLISS,
  CURRY_KICKS,
  DAIRY_DELIGHTS,
  DINNER_DELIGHTS,
  EASY_EATS,
  EVERYDAY_ESSENTIALS,
  FLAVOURFUL_FEASTS,
  FRESH_FINDS,
  FRESH_FINDS_02,
  FRUIT_FAVES,
  MEATBALL,
  NOODLE_JOY,
  NOODLES,
  PANCAKE,
  PIZZA,
  SALAD_SIZZLE,
  SANDWICH,
  SPIRIT_SELECTION,
  STEAK_CRAVINGS,
  SUSHI,
  SUSHI_SENSATIONS,
  TACO,
  VAGGIE,
  WING_WONDERS,
  WRAP_FIX,
} from "./images";
import Facebook from "./svgs/Facebook";
import Instagram from "./svgs/Instagram";
import LinkedIn from "./svgs/LinkedIn";
import Twitter from "./svgs/Twitter";
import Youtube from "./svgs/Youtube";

export const locations = [
  { id: 1, location: "Camden Town, London" },
  { id: 2, location: "London, UK" },
  { id: 3, location: "New York, NY" },
  { id: 4, location: "Paris, France" },
  { id: 5, location: "Berlin, Germany" },
  { id: 6, location: "Tokyo, Japan" },
  { id: 7, location: "Sydney, Australia" },
  { id: 8, location: "Toronto, Canada" },
  { id: 9, location: "Dubai, UAE" },
  { id: 10, location: "Singapore" },
  { id: 11, location: "Amsterdam, Netherlands" },
  { id: 12, location: "Barcelona, Spain" },
  { id: 13, location: "Rome, Italy" },
  { id: 14, location: "Hong Kong" },
  { id: 15, location: "Mumbai, India" },
  { id: 16, location: "São Paulo, Brazil" },
  { id: 17, location: "Cape Town, South Africa" },
  { id: 18, location: "Stockholm, Sweden" },
  { id: 19, location: "Seoul, South Korea" },
  { id: 20, location: "Vancouver, Canada" },
  { id: 21, location: "Melbourne, Australia" },
  { id: 22, location: "Madrid, Spain" },
  { id: 23, location: "Vienna, Austria" },
  { id: 24, location: "Bangkok, Thailand" },
  { id: 25, location: "Dublin, Ireland" },
  { id: 26, location: "Oslo, Norway" },
  { id: 27, location: "San Francisco, CA" },
  { id: 28, location: "Los Angeles, CA" },
  { id: 29, location: "Chicago, IL" },
  { id: 30, location: "Miami, FL" },
  { id: 31, location: "Manchester, UK" },
  { id: 32, location: "Edinburgh, Scotland" },
  { id: 33, location: "Munich, Germany" },
  { id: 34, location: "Hamburg, Germany" },
  { id: 35, location: "Zurich, Switzerland" },
  { id: 36, location: "Copenhagen, Denmark" },
  { id: 37, location: "Brussels, Belgium" },
  { id: 38, location: "Lisbon, Portugal" },
  { id: 39, location: "Athens, Greece" },
  { id: 40, location: "Istanbul, Turkey" },
  { id: 41, location: "Moscow, Russia" },
  { id: 42, location: "Shanghai, China" },
  { id: 43, location: "Beijing, China" },
  { id: 44, location: "Osaka, Japan" },
  { id: 45, location: "Auckland, New Zealand" },
  { id: 46, location: "Mexico City, Mexico" },
  { id: 47, location: "Buenos Aires, Argentina" },
  { id: 48, location: "Lima, Peru" },
  { id: 49, location: "Santiago, Chile" },
  { id: 50, location: "Tel Aviv, Israel" },
];

export const popularCategories = [
  {
    id: 1,
    title: "Burgers",
    imgUrl: BURGER,
  },
  {
    id: 2,
    title: "Sandwiches",
    imgUrl: SANDWICH,
  },
  {
    id: 3,
    title: "Biryani",
    imgUrl: BIRYANI,
  },
  {
    id: 4,
    title: "Noodles",
    imgUrl: NOODLES,
  },
  {
    id: 5,
    title: "Burgers",
    imgUrl: BURGER,
  },
  {
    id: 6,
    title: "Sandwiches",
    imgUrl: SANDWICH,
  },
  {
    id: 7,
    title: "Biryani",
    imgUrl: BIRYANI,
  },
  {
    id: 8,
    title: "Noodles",
    imgUrl: NOODLES,
  },
];

export const delivaryAndcollections = [
  {
    id: 1,
    title: "Pizza Love",
    availablePlaces: 6,
    imgUrl: PIZZA,
  },
  {
    id: 2,
    title: "Breakfast Bliss",
    availablePlaces: 6,
    imgUrl: BREAKFAST,
  },
  {
    id: 3,
    title: "Sushi Hits",
    availablePlaces: 6,
    imgUrl: SUSHI,
  },
  {
    id: 4,
    title: "Steak Cravings",
    availablePlaces: 6,
    imgUrl: STEAK_CRAVINGS,
  },
];

export const dineOutItems = [
  {
    id: 1,
    title: "Taco Treats",
    availablePlaces: 6,
    imgUrl: TACO,
  },
  {
    id: 2,
    title: "Burger Crush",
    availablePlaces: 6,
    imgUrl: BURGER_CRUSH,
  },
  {
    id: 3,
    title: "Meatball Magic",
    availablePlaces: 6,
    imgUrl: MEATBALL,
  },
  {
    id: 4,
    title: "Curry Kicks",
    availablePlaces: 6,
    imgUrl: CURRY_KICKS,
  },
];

export const dineInItems = [
  {
    id: 1,
    title: "Wing Wonders",
    availablePlaces: 6,
    imgUrl: WING_WONDERS,
  },
  {
    id: 2,
    title: "Pancake Perfection",
    availablePlaces: 6,
    imgUrl: PANCAKE,
  },
  {
    id: 3,
    title: "Wrap Fix",
    availablePlaces: 6,
    imgUrl: WRAP_FIX,
  },
  {
    id: 4,
    title: "Noodle Joy",
    availablePlaces: 6,
    imgUrl: NOODLE_JOY,
  },
];

export const groceryItems = [
  {
    id: 1,
    title: "Fresh Finds",
    availablePlaces: 6,
    imgUrl: FRESH_FINDS,
  },
  {
    id: 2,
    title: "Veggie Picks",
    availablePlaces: 6,
    imgUrl: VAGGIE,
  },
  {
    id: 3,
    title: "Dairy Delights",
    availablePlaces: 6,
    imgUrl: DAIRY_DELIGHTS,
  },
  {
    id: 4,
    title: "Fruit Faves",
    availablePlaces: 6,
    imgUrl: FRUIT_FAVES,
  },
];

export const collections = [
  {
    id: 1,
    title: "Salad Sizzle",
    availablePlaces: 6,
    imgUrl: SALAD_SIZZLE,
  },
  {
    id: 2,
    title: "Burger Bites",
    availablePlaces: 6,
    imgUrl: BURGER_BITES,
  },
  {
    id: 3,
    title: "Burrito Bliss",
    availablePlaces: 6,
    imgUrl: BURRITO_BLISS,
  },
  {
    id: 4,
    title: "Sushi Sensations",
    availablePlaces: 6,
    imgUrl: SUSHI_SENSATIONS,
  },
];

export const mealKitsAndBoxMeals = [
  {
    id: 1,
    title: "Boxed Bliss",
    availablePlaces: 6,
    imgUrl: BOXED_BLISS,
  },
  {
    id: 2,
    title: "Dinner Delights",
    availablePlaces: 6,
    imgUrl: DINNER_DELIGHTS,
  },
  {
    id: 3,
    title: "Flavourful Feasts",
    availablePlaces: 6,
    imgUrl: FLAVOURFUL_FEASTS,
  },
  {
    id: 4,
    title: "Easy Eats",
    availablePlaces: 6,
    imgUrl: EASY_EATS,
  },
];

export const groceryAndAlcoholItems = [
  {
    id: 1,
    title: "Fresh Finds",
    availablePlaces: 6,
    imgUrl: FRESH_FINDS_02,
  },
  {
    id: 2,
    title: "Spirits Selection",
    availablePlaces: 6,
    imgUrl: SPIRIT_SELECTION,
  },
  {
    id: 3,
    title: "Beverage Bounty",
    availablePlaces: 6,
    imgUrl: BEVERAGE_BOUNTY,
  },
  {
    id: 4,
    title: "Everyday Essentials",
    availablePlaces: 6,
    imgUrl: EVERYDAY_ESSENTIALS,
  },
];

export const faqData = [
  {
    title: "Popular cuisines near me",
    content:
      "Arabian food, Bakery food, Beverages, Indian food, Chinese food, Desserts food, Ice Cream",
  },
  {
    title: "Popular restaurant types near me",
    content: "Casual Dining, Quick Bites, Delivery, Cafes, Fine Dining",
  },
  {
    title: "Top Restaurant Chains",
    content: "McDonald's, KFC, Burger King, Subway, Domino's",
  },
  {
    title: "Cities We Deliver To",
    content: "New York, Los Angeles, Chicago, Houston, Phoenix",
  },
];

export const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Team", href: "/team" },
];

export const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Privacy policy", href: "/privacy" },
];

export const contactLinks = [
  { label: "Help & Support", href: "/support" },
  { label: "Partner with us", href: "/partner" },
  { label: "Ride with us", href: "/ride" },
];

export const socialLinks = [
  {
    label: "facebook",
    href: "https://www.facebook.com/plateaway/",
    icon: Facebook,
  },
  { label: "twitter", href: "https://x.com/getfudo", icon: Twitter },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/company/getfudo/",
    icon: LinkedIn,
  },
  {
    label: "instagram",
    href: "https://www.instagram.com/getfudo/",
    icon: Instagram,
  },
  { label: "youtube", href: "https://www.youtube.com/@GetFudo", icon: Youtube },
];
