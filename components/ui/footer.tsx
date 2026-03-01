import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-500 text-white p-4 text-center">
      <p>&copy; 2026 NK Dev Dynasty. All rights reserved.</p>
      <div className="mt-2">
        <a href="/contact" className="hover:underline mr-4">
          Contact
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
