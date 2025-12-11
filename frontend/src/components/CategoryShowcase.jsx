import React from 'react';
import { Link } from 'react-router-dom';

// Reverting to the original 4 categories for a standard 1-row showcase
const categories = [
  {
    id: 1,
    name: "SHIRTS",
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270065/f41cb7e3-f91a-4dc1-8738-35f610929e62.png',
    path: '/category/formal-shirts'
  },
  {
    id: 2,
    name: "TSHIRTS",
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270201/2bc21bba-d836-46f0-81a0-6e045d2b07fd.png',
    path: '/category/tshirts'
  },
  {
    id: 3,
    name: 'PERFUMES',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270303/8ebb88f6-a40e-48a5-a1f3-6b98f254c666.png',
    path: '/category/perfumes'
  },
  {
    id: 4,
    name: 'Shoes',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765356722/c8ebeacb5152e0d91ea0158bc3d94f8b_uaalsc.jpg',
    path: '/category/shoes'
  },
  {
    id:5,
    name: 'PANTS',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270378/ce7c75f8-2069-4b99-be54-f0fbefda46f3.png',
    path: '/category/pants'
  },
   {
    id: 6,
    name: 'Sunglasses',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765461889/43753e06bc6de0fcff2745b62424bace_jzwtyc.jpg',
    path: '/category/sunglasses'
  },
   {
    id: 7,
    name: 'WATCHES',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270630/e84cc747-7a2e-4a65-ad85-0750fc16b74c.png',
    path: '/category/watches'
  },
   {
    id: 8,
    name: 'SHORTS & BOXERS',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270714/557c7404-59a5-46d4-84a9-5fa505f2e7dc.png',
    path: '/category/shorts'
  }
];

const CategoryShowcase = () => {
  return (
    // Outer Container: White background, tight vertical padding
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header: Centered, simple, capitalized text */}
        <h2 className="text-xl font-medium tracking-widest uppercase text-gray-900 text-center mb-10 sm:mb-12">
          CATEGORIES
        </h2>
        
        {/* 🚀 Grid Layout: Set to 4 columns (lg:grid-cols-4) and 2 columns on mobile (sm:grid-cols-2) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10">
          {categories.map((category) => (
            <div key={category.id} className="group flex flex-col items-center text-center">
              <Link 
                to={category.path}
                className="block w-full"
              >
                {/* Image Container: Simple square, light gray background */}
                <div 
                    className="aspect-square bg-gray-100 overflow-hidden" 
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              </Link>
              
              {/* Text: Centered, capitalized, standard text style, small margin top */}
              <div className="mt-3">
                <p className="text-xs font-medium tracking-wider uppercase text-gray-800">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;