import React, { useState } from "react";
import Nav from "./Nav";
import { MenuIcon, XIcon } from "@heroicons/react/solid";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold"></div>
        <button
          className="block md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-between w-full bg-gray-600`}
        >
          <Nav />
        </nav>
      </div>
    </header>
  );
};

export default Header;
