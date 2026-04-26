import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-deepBlue-600" />,
      title: "Email Us",
      details: "support@ajosave.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Call Us",
      details: "+234 800 AJOSAVE",
      description: "Mon-Fri, 9AM-6PM WAT"
    },
    {
      icon: <MapPin className="w-6 h-6 text-purple-600" />,
      title: "Visit Us",
      details: "Lagos, Nigeria",
      description: "By appointment only"
    },
    {
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM",
      description: "Weekend support available"
    }
  ];

  const faqs = [
    {
      question: "How secure is my money with AjoSave?",
      answer: "Your funds are protected with bank-level security, regulatory compliance, and insurance coverage. We use advanced encryption and secure payment processing."
    },
    {
      question: "What happens if someone doesn't pay?",
      answer: "We have strict verification processes and backup systems. All members are verified, and we have contingency funds to ensure payouts continue as scheduled."
    },
    {
      question: "Can I leave a group early?",
      answer: "Yes, but there are terms and conditions. You can leave after receiving your payout or arrange for someone to take your place with group approval."
    },
    {
      question: "How do I know when it's my turn to receive money?",
      answer: "You'll receive notifications via SMS, email, and in-app alerts. The payout schedule is transparent and available in your dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We're here to help! Reach out to our friendly support team 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                {info.title}
              </h3>
              <p className="text-deepBlue-600 font-medium mb-1">
                {info.details}
              </p>
              <p className="text-deepBlue-500 text-sm">
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-deepBlue-100">
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="account">Account Issues</option>
                  <option value="group">Group Management</option>
                  <option value="payment">Payment Issues</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-deepBlue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                Need Quick Help?
              </h3>
              <p className="text-deepBlue-700 mb-4">
                For immediate assistance, check out our help center or start a live chat.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-deepBlue-600 text-white py-2 px-4 rounded-lg hover:bg-deepBlue-700 transition-colors">
                  Start Live Chat
                </button>
                <button className="w-full bg-white text-deepBlue-600 py-2 px-4 rounded-lg border border-deepBlue-200 hover:bg-deepBlue-50 transition-colors">
                  Visit Help Center
                </button>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100">
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">
                Response Times
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-deepBlue-600">Live Chat:</span>
                  <span className="font-medium text-green-600">Instant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-deepBlue-600">Email:</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-deepBlue-600">Phone:</span>
                  <span className="font-medium">Immediate</span>
                </div>
              </div>
            </div>

            {/* Office Image */}
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://plus.unsplash.com/premium_photo-1661963781048-9780e4ecae5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29vcGVyYXRlJTIwb2ZmaWNlfGVufDB8fDB8fHww" 
                alt="AjoSave Office" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 mr-3" />
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100">
                <h3 className="text-lg font-semibold text-deepBlue-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-deepBlue-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Emergency Support
          </h3>
          <p className="text-red-700 mb-4">
            For urgent account security issues or unauthorized transactions, contact us immediately:
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <a 
              href="tel:+2348000000000" 
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Emergency Hotline: +234 800 EMERGENCY
            </a>
            <a 
              href="mailto:emergency@ajosave.com" 
              className="text-red-600 hover:text-red-800 font-medium"
            >
              emergency@ajosave.com
            </a>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Contact;