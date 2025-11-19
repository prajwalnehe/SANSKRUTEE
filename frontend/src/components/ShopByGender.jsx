import React, { useEffect, useState } from "react";

export default function ShopByGender() {
  const HEADER_HEIGHT_PX = 120;

  // Desktop Images
  const desktopImages = [
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763377364/0954ac19-8461-4553-8d0a-0ec279eada25.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763375956/15a07875-43f8-4026-b9ac-a9f2ce416412.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763376016/954a65d1-cbd4-458a-b8d2-050cc8bd48a8.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763376933/abde0159-3ccb-47c4-b123-d926a50b481d.png",
  ];

  // Mobile Images (from Vastramay — your provided links)
  const mobileImages = [
    "https://vastramay.com/cdn/shop/files/home_sbg_1311_men_mob_230x.progressive.jpg?v=1763045003",
    "https://vastramay.com/cdn/shop/files/home_sbc_2_mob_230x.progressive.jpg?v=1763018424",
    "https://vastramay.com/cdn/shop/files/home_sbc_3_mob_230x.progressive.jpg?v=1763018466",
    "https://vastramay.com/cdn/shop/files/home_sbc_4_mob_230x.progressive.jpg?v=1763018528",
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const gridWrapperStyle = {
    height: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
  };

  const imagesToUse = isMobile ? mobileImages : desktopImages;

  return (
    <section className="w-full min-h-screen overflow-hidden">

      {/* Header */}
      <div
        className="w-full flex flex-col items-center justify-center bg-white"
        style={{ height: HEADER_HEIGHT_PX }}
      >
        <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-3 tracking-wide">
          Shop by Gender
        </h2>
        <p className="text-base md:text-lg text-gray-600 font-light italic">
          Styled for All
        </p>
      </div>

      {/* 2×2 Grid for both Desktop & Mobile */}
      <div
        className="grid grid-cols-2 grid-rows-2 gap-0 w-full h-full"
        style={gridWrapperStyle}
      >
        {imagesToUse.map((image, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden">
            <img
              src={image}
              alt={`tile-${idx}`}
              className="w-full h-full object-cover block"
              draggable={false}
              style={{
                objectPosition: "center center", // same crop behavior like Vastramay
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
