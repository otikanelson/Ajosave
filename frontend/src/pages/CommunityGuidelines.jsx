import React from 'react';
import { Users, Heart, AlertCircle, CheckCircle, Ban, MessageSquare } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const CommunityGuidelines = () => {
  const coreValues = [
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Respect & Integrity",
      description: "Treat all community members with respect and conduct yourself with integrity in all interactions."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Inclusivity",
      description: "Welcome members from all backgrounds and treat everyone fairly regardless of their status."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Transparency",
      description: "Be honest and transparent in all communications and financial dealings within your group."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
      title: "Accountability",
      description: "Take responsibility for your actions and commitments to your group members."
    }
  ];

  const dosDonts = [
    {
      title: "DO's",
      items: [
        "Communicate openly and honestly with group members",
        "Pay your contributions on time",
        "Respect group rules and decisions",
        "Help resolve conflicts peacefully",
        "Report suspicious activity",
        "Support fellow members' financial goals",
        "Keep personal information confidential",
        "Follow platform terms and conditions"
      ],
      icon: <CheckCircle className="w-6 h-6 text-green-600" />
    },
    {
      title: "DON'Ts",
      items: [
        "Harass, threaten, or abuse other members",
        "Share false or misleading information",
        "Attempt to defraud or scam members",
        "Violate anyone's privacy or confidentiality",
        "Use the platform for illegal activities",
        "Manipulate group decisions or voting",
        "Spam or send unsolicited messages",
        "Discriminate based on protected characteristics"
      ],
      icon: <Ban className="w-6 h-6 text-red-600" />
    }
  ];

  const prohibitedBehaviors = [
    {
      title: "Fraud & Deception",
      description: "Any attempt to deceive, defraud, or misrepresent yourself or your financial status is strictly prohibited."
    },
    {
      title: "Harassment & Abuse",
      description: "Harassment, bullying, threats, or abusive language toward any member will not be tolerated."
    },
    {
      title: "Discrimination",
      description: "Discrimination based on race, ethnicity, religion, gender, sexual orientation, or disability is prohibited."
    },
    {
      title: "Illegal Activities",
      description: "Using the platform for money laundering, terrorism financing, or any illegal activities is strictly forbidden."
    },
    {
      title: "Privacy Violations",
      description: "Sharing, selling, or misusing other members' personal or financial information is prohibited."
    },
    {
      title: "Manipulation",
      description: "Attempting to manipulate group decisions, voting, or other members through deception is not allowed."
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First minor violation - member receives a warning and must acknowledge the guidelines."
    },
    {
      level: "Suspension",
      description: "Repeated violations or serious misconduct - account suspended for 7-30 days."
    },
    {
      level: "Permanent Ban",
      description: "Severe violations or fraud - account permanently banned from the platform."
    },
    {
      level: "Legal Action",
      description: "Criminal activity - we cooperate with law enforcement and pursue legal remedies."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
            Community Guidelines
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
            Our guidelines help create a safe, respectful, and trustworthy community for all members.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-deepBlue-100">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-deepBlue-800 ml-4">
                  {value.title}
                </h3>
              </div>
              <p className="text-deepBlue-600 ml-12">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {dosDonts.map((section, index) => (
            <div key={index} className={`rounded-xl p-8 border-2 ${
              section.title === "DO's" 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                {section.icon}
                <span className={`ml-3 ${section.title === "DO's" ? 'text-green-700' : 'text-red-700'}`}>
                  {section.title}
                </span>
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className={`flex items-start ${section.title === "DO's" ? 'text-green-800' : 'text-red-800'}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0 ${
                      section.title === "DO's" ? 'bg-green-600' : 'bg-red-600'
                    }`}></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Prohibited Behaviors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Prohibited Behaviors
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prohibitedBehaviors.map((behavior, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-start mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-semibold text-deepBlue-800">
                    {behavior.title}
                  </h3>
                </div>
                <p className="text-deepBlue-600 ml-9">
                  {behavior.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-deepBlue-100 mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Enforcement & Consequences
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                    {consequence.level}
                  </h3>
                  <p className="text-deepBlue-600">
                    {consequence.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Admin Responsibilities */}
        <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8 md:p-12 border border-deepBlue-200 mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-6">
            Group Admin Responsibilities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-3">
                Admins Must:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-deepBlue-600">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Enforce group rules fairly and consistently</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Maintain transparent communication</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Resolve disputes impartially</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Report violations to AjoSave</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deepBlue-800 mb-3">
                Admins Cannot:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-deepBlue-600">
                  <Ban className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Discriminate against members</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <Ban className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Manipulate group decisions</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <Ban className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Misuse member funds</span>
                </li>
                <li className="flex items-start text-deepBlue-600">
                  <Ban className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Share confidential information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Violation */}
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Report a Violation</h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            If you witness a violation of these guidelines, please report it to our moderation team immediately.
          </p>
          <button className="bg-white text-deepBlue-600 px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-50 transition-colors">
            Report Violation
          </button>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default CommunityGuidelines;
