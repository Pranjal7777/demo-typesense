import theme from "../../../constants/theme.json";

const Theme = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Theme Colors</h2>
      {Object.entries(theme.colors).map(([colorName, shades]) => (
        <div key={colorName} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 capitalize">{colorName}</h3>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-9">
            {Object.entries(shades).map(([shade, value]) => (
              <div key={shade} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg shadow-md mb-2"
                  style={{ backgroundColor: value }}
                />
                <span className="text-sm font-medium">{shade}</span>
                <span className="text-xs text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    // <div className="flex flex-col items-start justify-start gap-10 my-10 px-10">
    //   <Typography as="h1" className="">
    //     Themes
    //   </Typography>
    //   {themeKeys.map((themeKey) => (
    //     <div
    //       key={themeKey}
    //       className="flex flex-col items-start justify-start gap-2"
    //     >
    //       <Typography as="h2" className="">
    //         {themeKey}
    //       </Typography>
    //       <div className="flex items-start justify-start gap-5">
    //         {Object.keys(theme[themeKey as keyof typeof Theme]).map(
    //           (themeItem) => (
    //             <div
    //               key={themeItem}
    //               className="flex flex-col items-center justify-center gap-1"
    //             >
    //               <Typography as="p" className="">
    //                 {themeItem}
    //               </Typography>
    //               <div
    //                 className={`w-20 h-20`}
    //                 style={{
    //                   backgroundColor:
    //                     theme[themeKey as keyof typeof Theme][
    //                       themeItem as keyof (typeof theme)[keyof typeof theme]
    //                     ],
    //                 }}
    //               ></div>
    //               <Typography>
    //                 {
    //                   theme[themeKey as keyof typeof Theme][
    //                     themeItem as keyof (typeof theme)[keyof typeof theme]
    //                   ]
    //                 }
    //               </Typography>
    //             </div>
    //           )
    //         )}
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default Theme;
