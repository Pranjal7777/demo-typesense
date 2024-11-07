import React from 'react';
import Image from 'next/image';

// Define the props interface
interface BlogPostProps {
  title: string;
  postedBy: string;
  postedDate: string;
  description: string;
  image: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, postedBy, postedDate, description, image }) => {
  // Render the component
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <Image src={image} alt="image" layout="fill" objectFit="cover" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 17a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-xs lg:text-sm">{postedBy}</span>
          <span className="mx-1">-</span>
          <span className="text-xs lg:text-sm">{postedDate}</span>
        </div>
        <p className="text-sm lg:text-base text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default BlogPost;
