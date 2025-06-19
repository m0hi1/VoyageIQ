import Logo from './../../assets/images/logo3.png';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from 'react-icons/fa';
import Newsletter from '../../shared/Newsletter';
// import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-5 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <img src={Logo} alt="VoyageIQ Logo" className="logo  md:mr-12 " />
          <div className="flex flex-col mt-8 text-center md:text-left">
            <p className="mb-2">Address: ACE, Ambala</p>
            <p className="mb-2">Phone: +91 1234567890</p>
            <p className="mb-2">Email: info@voyageiq.com</p>
          </div>
        </div>

        <Newsletter />

        {/* Social Media Links */}
        <div className="flex md:flex-col gap-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-white hover:text-gray-300"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>
      {/* Footer Bottom: Copyright and Credits */}
      <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
        <p className="mb-2 text-lg font-semibold italic animate-gradient-xy">
          ✨ Made For Final Year Project-III.
        </p>
        <div>
          <Link
            to="/about-us"
            className="text-white mx-2 no-underline hover:underline"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-white mx-2 no-underline hover:underline"
          >
            Contact
          </Link>
          <Link
            to="/privacy-policy"
            className="text-white mx-2 no-underline hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
      <p className="flex items-end justify-center mt-4 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} VoyageIQ. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
