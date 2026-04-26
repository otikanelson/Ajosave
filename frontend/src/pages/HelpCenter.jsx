import React, { useState } from 'react';
import { Search, ChevronDown, BookOpen, MessageCircle, Video, Shield } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "How do I create a savings group?",
      answer: "To create a savings group, go to your dashboard, click 'Create Group', set your group parameters (contribution amount, frequency, duration), and invite members. You can invite friends via email or share a unique group code."
    },
    {
      question: "What happens if I miss a contribution?",
      answer: "Missing a contribution may affect your eligibility for the next payout cycle. Our system will send you reminders before the deadline. Contact your group admin or our support team if you need to discuss payment arrangements."
    },
    {
      question: "How is the payout order determined?",
      answer: "The payout order is determined by the rotation system set when the group was created. This is typically first-come-first-served or a predetermined rotation. All members can see the payout schedule in the group details."
    },
    {
      question: "Is my money safe with AjoSave?",
      answer: "Yes. AjoSave is licensed by the Central Bank of Nigeria (CBN) and insured by NDIC. All funds are held in segregated accounts and protected by bank-level security encryption."
    },
    {
      question: "What are the fees?",
      answer: "AjoSave charges a small platform fee of 1% per transaction. There are no hidden charges. All fees are clearly displayed before you confirm any transaction."
    },
    {
      question: "How long does a withdrawal take?",
      answer: "Withdrawals typically take 1-3 business days depending on your bank. You can track your withdrawal status in real-time from your wallet dashboard."
    },
    {
      question: "Can I leave a group?",
      answer: "Yes, you can leave a group anytime. However, if you leave during an active cycle, you forfeit your payout for that cycle. Leaving before the cycle starts results in a full refund of contributions."
    },
    {
      question: "What if there's a dispute in my group?",
      answer: "Our support team can help mediate disputes. We have a formal dispute resolution process that ensures fair treatment for all members. Contact support with details of the dispute."
    }
  ];

  const categories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Getting Started",
      description: "Learn the basics of AjoSave",
      articles: 5
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Groups & Communities",
      description: "Manage your savings groups",
      articles: 8
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Safety",
      description: "Protect your account and funds",
      articles: 6
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Tutorials",
      description: "Step-by-step visual guides",
      articles: 12
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
            Find answers to your questions and learn how to get the most out of AjoSave
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-deepBlue-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-deepBlue-200 rounded-lg focus:outline-none focus:border-deepBlue-600 focus:ring-2 focus:ring-deepBlue-100 text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100 hover:shadow-xl transition-shadow cursor-pointer text-center">
              <div className="flex justify-center mb-4 text-deepBlue-600">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                {category.title}
              </h3>
              <p className="text-deepBlue-600 text-sm mb-3">
                {category.description}
              </p>
              <p className="text-deepBlue-500 text-xs font-medium">
                {category.articles} articles
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-deepBlue-100 shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-deepBlue-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-deepBlue-800">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-deepBlue-600 transition-transform ${
                        expandedFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 border-t border-deepBlue-100 bg-deepBlue-50">
                      <p className="text-deepBlue-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-deepBlue-600">No articles found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <button className="bg-white text-deepBlue-600 px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default HelpCenter;
