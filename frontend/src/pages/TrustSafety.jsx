import React from 'react';
import { Shield, Users, AlertCircle, CheckCircle, Heart, Zap } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const TrustSafety = () => {
  const trustPillars = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure Transactions",
      description: "All transactions are encrypted and verified to prevent fraud and unauthorized access."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Verified Members",
      description: "All users undergo identity verification to ensure you're saving with trusted community members."
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
      title: "Fraud Detection",
      description: "Our AI-powered system monitors for suspicious patterns and alerts you to potential threats."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Member Protection",
      description: "We have insurance and protection mechanisms to safeguard your funds and investments."
    }
  ];

  const safetyGuidelines = [
    {
      title: "Verify Group Information",
      items: [
        "Check group admin credentials and history",
        "Review group rules and payout schedule",
        "Confirm all members are verified users",
        "Ask questions before joining"
      ]
    },
    {
      title: "Protect Your Account",
      items: [
        "Use a strong, unique password",
        "Enable two-factor authentication",
        "Never share your login credentials",
        "Log out on shared devices"
      ]
    },
    {
      title: "Monitor Transactions",
      items: [
        "Review all transactions regularly",
        "Set up transaction alerts",
        "Report discrepancies immediately",
        "Keep records of all payments"
      ]
    },
    {
      title: "Report Issues",
      items: [
        "Report suspicious activity immediately",
        "Document all evidence of fraud",
        "Contact support with details",
        "Follow up on your report"
      ]
    }
  ];

  const redFlags = [
    "Requests for personal information via email or SMS",
    "Pressure to join a group quickly",
    "Promises of guaranteed returns",
    "Requests to pay outside the platform",
    "Unverified group administrators",
    "Unusual transaction patterns",
    "Requests to share your password",
    "Suspicious links or attachments"
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
            Trust & Safety
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
            We're committed to creating a safe and trustworthy platform for all our users.
          </p>
        </div>

        {/* Trust Pillars */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {trustPillars.map((pillar, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-deepBlue-100">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-semibold text-deepBlue-800 ml-4">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-deepBlue-600 ml-12">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Safety Guidelines */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Safety Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {safetyGuidelines.map((guideline, index) => (
              <div key={index} className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 rounded-xl p-8 border border-deepBlue-200">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  {guideline.title}
                </h3>
                <ul className="space-y-3">
                  {guideline.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-deepBlue-600">
                      <span className="inline-block w-2 h-2 bg-deepBlue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 border-2 border-red-200 mb-16">
          <div className="flex items-start mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 mr-4 flex-shrink-0 mt-1" />
            <h2 className="text-3xl font-bold text-deepBlue-800">
              Red Flags to Watch Out For
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 ml-12">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start">
                <Zap className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-deepBlue-700">{flag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Process */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-deepBlue-100 mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Our Verification Process
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                    Identity Verification
                  </h3>
                  <p className="text-deepBlue-600">
                    All users must provide valid government-issued ID and proof of address. We use advanced verification 
                    technology to confirm authenticity.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                    Bank Account Verification
                  </h3>
                  <p className="text-deepBlue-600">
                    We verify your bank account details to ensure you're the legitimate account holder. This protects 
                    against fraud and unauthorized transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                    Behavioral Analysis
                  </h3>
                  <p className="text-deepBlue-600">
                    Our system analyzes user behavior patterns to detect suspicious activity and potential fraud. 
                    We monitor for unusual transactions and account access.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                    Ongoing Monitoring
                  </h3>
                  <p className="text-deepBlue-600">
                    We continuously monitor accounts for suspicious activity. If we detect anything unusual, 
                    we'll contact you immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Abuse */}
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Report Abuse or Suspicious Activity</h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            If you encounter any suspicious behavior or believe someone is violating our policies, please report it immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-deepBlue-600 px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-50 transition-colors">
              Report Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-deepBlue-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default TrustSafety;
