import React from "react";

interface FooterBottomProps {
  className?: string;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ className = "" }) => {
  return (
    <div className={`text-center mt-12 mb-3 ${className}`}>
      <p className="text-sm sm:text-base font-poppins">
        &copy; {new Date().getFullYear()} Chatter. All rights reserved.
      </p>
    </div>
  );
};

export default FooterBottom;
