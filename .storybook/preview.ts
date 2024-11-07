import "@/app/globals.css";
import type { Preview } from "@storybook/react";
const customViewports = {
  galaxyZFold5: {
    name: "Galaxy Z Fold 5",
    styles: {
      width: "344px",
      height: "882px",
    },
  },
  iPhoneSE: {
    name: "iPhone SE",
    styles: {
      width: "375px",
      height: "667px",
    },
  },

  iPhoneXR: {
    name: "iPhone XR",
    styles: {
      width: "414px",
      height: "896px",
    },
  },
  iPhone15ProMax: {
    name: "iPhone 15 Pro Max",
    styles: {
      width: "430px",
      height: "932px",
    },
  },
  samsungGalaxyS24: {
    name: "Samsung Galaxy S24",
    styles: {
      width: "393px",
      height: "851px",
    },
  },
  samsungGalaxyS24Plus: {
    name: "Samsung Galaxy S24 Plus",
    styles: {
      width: "384px ",
      height: "832px",
    },
  },
  ipadMini: {
    name: "iPad Mini",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },

  ipadAir: {
    name: "iPad Air",
    styles: {
      width: "820px",
      height: "1180px",
    },
  },

  ipadPro: {
    name: "iPad Pro",
    styles: {
      width: "1024px",
      height: "1366px",
    },
  },

  nestHub: {
    name: "Nest Hub",
    styles: {
      width: "1024px",
      height: "600px",
    },
  },

  nestHubMax: {
    name: "Nest Hub Max",
    styles: {
      width: "1280px",
      height: "800px",
    },
  },
  laptopMax: {
    name: "Laptop Max",
    styles: {
      width: "1440px",
      height: "900px",
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      viewports: customViewports,
    },
    docs: {
      autodocs: "tag",
    },
  },

  tags: ["autodocs"],
};

export default preview;
