import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-green-600" />,
      title: "Bank-Level Encryption",
      description: "All data is encrypted using 256-bit SSL/TLS encryption, the same standard used by major banks."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Two-Factor Authentication",
      description: "Protect your account with optional 2FA using authenticator apps or SMS verification."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Real-Time Monitoring",
      description: "Our security team monitors all transactions 24/7 for suspicious activity and fraud."
    },
    {
      icon: <Key className="w-8 h-8 text-orange-600" />,
      title: "Secure Authentication",
      description: "Biometric login options and secure password requirements keep your account safe."
    }
  ];

  const bestPractices = [
    {
      title: "Use a Strong Password",
      tips: [
        "At least 12 characters long",
        "Mix of uppercase, lowercase, numbers, and symbols",
        "Avoid personal information or common words",
        "Never share your password with anyone"
      ]
    },
    {
      title: "Enable Two-Factor Authentication",
      tips: [
        "Go to Settings > Security",
        "Enable 2FA using authenticator app or SMS",
        "Save backup codes in a safe place",
        "Update your phone number if it changes"
      ]
    },
    {
      title: "Protect Your Device",
      tips: [
        "Keep your phone/computer updated",
        "Use antivirus software",
        "Don't use public WiFi for sensitive transactions",
        "Lock your device when not in use"
      ]
    },
    {
      title: "Monitor Your Account",
      tips: [
        "Review transaction history regularly",
        "Set up transaction alerts",
        "Report suspicious activity immediately",
        "Check your linked bank accounts"
      ]
    }
  ];

  const regulatoryCompliance = [
    {
      title: "CBN Licensed",
      description: "AjoSave is licensed by the Central Bank of Nigeria and operates under their regulatory framework."
    },
    {
      title: "NDIC Insured",
      description: "Customer deposits are insured by the Nigeria Deposit Insurance Corporation up to ₦500,000 per account."
    },
    {
      title: "ISO 27001 Certified",
      description: "Our information security management system meets international standards for data protection."
    },
    {
      title: "PCI DSS Compliant",
      description: "We comply with Payment Card Industry Data Security Standards for secure payment processing."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
            Security & Safety
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
            Your security is our top priority. Learn how we protect your funds and personal information.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-deepBlue-100">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-deepBlue-800 ml-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-deepBlue-600 ml-12">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Security Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <div key={index} className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 rounded-xl p-8 border border-deepBlue-200">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-deepBlue-600">
                      <span className="inline-block w-2 h-2 bg-deepBlue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Regulatory Compliance
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {regulatoryCompliance.map((compliance, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-green-200">
                <div className="flex items-start mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-semibold text-deepBlue-800">
                    {compliance.title}
                  </h3>
                </div>
                <p className="text-deepBlue-600 ml-9">
                  {compliance.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Security Issue */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 border-2 border-orange-200 mb-16">
          <div className="flex items-start">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-deepBlue-800 mb-3">
                Found a Security Issue?
              </h2>
              <p className="text-deepBlue-600 mb-4">
                If you discover a security vulnerability, please report it responsibly to our security team. 
                Do not publicly disclose the issue until we've had time to address it.
              </p>
              <p className="text-deepBlue-700 font-medium">
                Email: security@ajosave.com
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-deepBlue-100">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Security FAQs
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                What happens if my account is compromised?
              </h3>
              <p className="text-deepBlue-600">
                Contact our support team immediately. We'll freeze your account, investigate the unauthorized activity, 
                and help recover any lost funds. Report suspicious activity as soon as possible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                How do I enable two-factor authentication?
              </h3>
              <p className="text-deepBlue-600">
                Go to Settings > Security > Two-Factor Authentication. Choose between authenticator app or SMS verification. 
                We recommend using an authenticator app for better security.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                Is my data shared with third parties?
              </h3>
              <p className="text-deepBlue-600">
                No. We never sell your personal data. We only share information with trusted payment processors and 
                regulatory authorities as required by law. See our Privacy Policy for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                What should I do if I receive a suspicious email claiming to be from AjoSave?
              </h3>
              <p className="text-deepBlue-600">
                Do not click any links or provide personal information. Forward the email to security@ajosave.com. 
                AjoSave will never ask for your password or sensitive information via email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Security;
