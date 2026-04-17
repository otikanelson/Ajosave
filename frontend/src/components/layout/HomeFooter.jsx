import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, X, XCircle, XIcon } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const HomeFooter = () => {
  const navigate = useNavigate();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Careers', path: '/careers' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms-conditions' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'Refund Policy', path: '/refund-policy' }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Security', path: '/security' },
      { label: 'Trust & Safety', path: '/trust-safety' },
      { label: 'Community Guidelines', path: '/community-guidelines' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/ajosave', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/ajosafe', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/ajosave', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/ajosave', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-deepBlue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logo} 
                alt="AjoSave Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">AjoSave</span>
            </div>
            <p className="text-deepBlue-200 mb-6 max-w-md">
              Digital Community Saving Made Simple, Secure, and Rewarding. 
              Join thousands of Nigerians building their financial future together.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-deepBlue-300" />
                <span className="text-deepBlue-200">support@ajosave.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-deepBlue-300" />
                <span className="text-deepBlue-200">+234 800 AJOSAVE</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-deepBlue-300" />
                <span className="text-deepBlue-200">Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-deepBlue-200 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-deepBlue-200 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-deepBlue-200 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="border-t border-deepBlue-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Links */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-deepBlue-800 rounded-full flex items-center justify-center hover:bg-deepBlue-700 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-deepBlue-300 text-sm">
                © {new Date().getFullYear()} AjoSave. All rights reserved.
              </p>
              <p className="text-deepBlue-400 text-xs mt-1">
                Licensed by CBN • Deposits insured by NDIC
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;