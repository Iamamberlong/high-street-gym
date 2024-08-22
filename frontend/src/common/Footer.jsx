import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-6 w-full">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        {/* Social Media Icons */}
        <div className="flex space-x-6">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-white hover:text-blue-600"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-white hover:text-blue-400"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:text-pink-600"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white hover:text-gray-400"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
        </div>

        {/* Internal Links */}
        <div className="flex space-x-6 mt-4">
          <Link
            to="/about"
            className="text-white hover:text-gray-400"
          >
            About Us
          </Link>
          <Link
            to="/classes"
            className="text-white hover:text-gray-400"
          >
            Classes
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-gray-400"
          >
            Contact
          </Link>
          <Link
            to="/blog"
            className="text-white hover:text-gray-400"
          >
            Blog
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 mt-4">
          &copy; {new Date().getFullYear()} High Street Gym. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
