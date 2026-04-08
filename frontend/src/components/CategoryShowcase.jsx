import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'MEN',
    image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764154213/0bf2018a-4136-4d0d-99bc-2c5755a65d2c.png',
    path: '/category/men'
  },
  {
    id: 2,
    name: 'WOMEN',
    image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764155957/b0484146-0b8f-4f41-b27f-8c1ee41a7179.png',
    path: '/category/women'
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
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-y-10 max-w-xl mx-auto">
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