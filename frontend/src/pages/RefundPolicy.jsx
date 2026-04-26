import React from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const RefundPolicy = () => {
  const navigate = useNavigate();

  const refundScenarios = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Eligible for Refund",
      items: [
        "Duplicate transactions within 24 hours",
        "Unauthorized transactions reported within 30 days",
        "Technical errors causing incorrect deductions",
        "Group cancellation before payout cycle begins",
        "Service failures affecting transaction completion"
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      title: "Not Eligible for Refund",
      items: [
        "Voluntary group withdrawal after cycle starts",
        "Transactions completed as requested by user",
        "Payments made to incorrect group (user error)",
        "Refunds requested after 90 days",
        "Transactions with confirmed recipient confirmation"
      ]
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with transaction details and reason for refund request"
    },
    {
      step: 2,
      title: "Investigation",
      description: "Our team reviews the transaction and verifies eligibility (3-5 business days)"
    },
    {
      step: 3,
      title: "Approval/Denial",
      description: "You'll receive notification of approval or denial with detailed explanation"
    },
    {
      step: 4,
      title: "Processing",
      description: "Approved refunds are processed within 5-7 business days to original payment method"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl">
            We're committed to fair and transparent refund practices. This policy outlines when and how refunds are processed.
          </p>
          <p className="text-deepBlue-500 text-sm mt-4">
            Last updated: April 2026
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">Quick Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-deepBlue-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-deepBlue-800 mb-1">Request Window</h3>
                <p className="text-deepBlue-600">Up to 90 days from transaction date</p>
              </div>
            </div>
            <div className="flex items-start">
              <DollarSign className="w-6 h-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-deepBlue-800 mb-1">Processing Time</h3>
                <p className="text-deepBlue-600">5-7 business days after approval</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-purple-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-deepBlue-800 mb-1">Refund Method</h3>
                <p className="text-deepBlue-600">Original payment method used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Scenarios */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8">Refund Eligibility</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {refundScenarios.map((scenario, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                <div className="flex items-center mb-6">
                  {scenario.icon}
                  <h3 className="text-xl font-semibold text-deepBlue-800 ml-3">
                    {scenario.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {scenario.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-deepBlue-600">
                      <span className="inline-block w-2 h-2 bg-deepBlue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8">How Refunds Work</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {refundProcess.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 border border-deepBlue-100 shadow-lg h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-3 mt-2">
                    {item.title}
                  </h3>
                  <p className="text-deepBlue-600 text-sm">
                    {item.description}
                  </p>
                </div>
                {index < refundProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-deepBlue-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-deepBlue-100 mb-12">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-6">Detailed Policy</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">1. Refund Request Submission</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                To request a refund, contact our support team through the Help Center or email support@ajosave.com. 
                Provide your transaction ID, date, amount, and detailed reason for the refund request. Requests must 
                be submitted within 90 days of the transaction date.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">2. Investigation Period</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                Our support team will investigate your claim within 3-5 business days. We may request additional 
                documentation or information to verify your claim. During this period, we'll review transaction logs, 
                group records, and payment confirmations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">3. Approval and Notification</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                You'll receive an email notification with the decision and explanation. If approved, the refund will 
                be processed to your original payment method. If denied, we'll provide a detailed explanation of why 
                your request doesn't meet our refund criteria.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">4. Processing Timeline</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                Approved refunds are processed within 5-7 business days. The time it takes for the refund to appear 
                in your account depends on your bank or payment provider. Some banks may take an additional 2-3 
                business days to credit the funds.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">5. Special Cases</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                <strong>Group Cancellation:</strong> If a group is cancelled before the payout cycle begins, all 
                contributions are refunded in full within 10 business days.
              </p>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                <strong>Unauthorized Transactions:</strong> If you report an unauthorized transaction, we'll conduct 
                a full investigation and may refund the amount while we investigate.
              </p>
              <p className="text-deepBlue-600 leading-relaxed">
                <strong>Technical Errors:</strong> If our system causes an error resulting in incorrect charges, 
                we'll refund the difference immediately upon verification.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">6. Disputes and Appeals</h3>
              <p className="text-deepBlue-600 leading-relaxed mb-4">
                If you disagree with our refund decision, you can appeal within 14 days of the decision. Submit your 
                appeal with additional evidence or documentation to support@ajosave.com. Our management team will 
                review your appeal and respond within 5 business days.
              </p>
            </section>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with a Refund?</h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            Our support team is here to help. Contact us anytime with questions about refunds or to submit a request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/support')}
              className="bg-white text-deepBlue-600 px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-50 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-deepBlue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default RefundPolicy;
