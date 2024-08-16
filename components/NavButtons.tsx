import Link from 'next/link';
import React from 'react';

interface ButtonProps{
  text:string
  onClick?:()=>void
}

const Button: React.FC<ButtonProps> = ({
  text, onClick
}) => {
  return (
    <Link href="/dashboard">
      <button className="relative flex items-left justify-center bg-blue-8000 text-white py-2 px-4 rounded-lg"
      onClick={onClick}
      >
        <div className="absolute inset-0 bg-blue-900 opacity-50 rounded-lg pointer-events-none"></div>
        <span className="relative flex items-center">
          {text} 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 53 58"
            height="15" 
            width="15" 
            className="ml-2" 
          >
            <path
              strokeWidth="9"
              stroke="currentColor"
              d="M44.25 36.3612L17.25 51.9497C11.5833 55.2213 4.5 51.1318 4.50001 44.5885L4.50001 13.4115C4.50001 6.86824 11.5833 2.77868 17.25 6.05033L44.25 21.6388C49.9167 24.9104 49.9167 33.0896 44.25 36.3612Z"
            ></path>
          </svg>
        </span>
      </button>
    </Link>
  );
};

export default Button;
