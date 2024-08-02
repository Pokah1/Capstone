import React from "react";
import PropTypes from "prop-types";

const FooterBottom = ({ className = "" }) => {
  return (
    <div className={`text-center mt-12 mb-2.25 ${className}`}>
      <p className="text-sm text-black">&copy; {new Date().getFullYear()} Chatter. All rights reserved.</p>
    </div>
  );
};

FooterBottom.propTypes = {
  className: PropTypes.string,
};

export default FooterBottom;
