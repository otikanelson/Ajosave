import React from 'react';
import { Shield, Users, TrendingUp, Award, Heart, Target } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8 text-deepBlue-600" />,
      title: "Trust & Security",
      description: "We prioritize the security of your funds and personal information with bank-level encryption and regulatory compliance."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community First",
      description: "Building strong financial communities where members support each other's savings goals and financial growth."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Financial Growth",
      description: "Empowering Nigerians to build wealth through disciplined saving and smart financial habits."
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      title: "Excellence",
      description: "Delivering exceptional service and continuously improving our platform to serve you better."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Transparency",
      description: "Complete transparency in all transactions, fees, and processes. No hidden charges, ever."
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: "Goal-Oriented",
      description: "Helping you achieve your financial goals through structured saving plans and community support."
    }
  ];

  const team = [
    {
      name: "Olanase Umar Ayobami",
      role: "CEO & Founder",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQFrS8pO9mQreg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730359211431?e=1778716800&v=beta&t=WchPt4K2E4cYcVCn44KnwHZCaoZeFgH_H7TdZaNjHls",
      bio: "Former Goldman Sachs analyst with 10+ years in fintech"
    },
    {
      name: "OluwaFeranmi Adeyemo",
      role: "Head of Operations",
      image: "https://media.licdn.com/dms/image/v2/D4E12AQGjj1e1guW_Tg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1682254771737?e=2147483647&v=beta&t=CRdK6YIxlq6jeIfjPN2bSwuwskJIDCeoeRo3M5M0Vao",
      bio: "Operations expert with deep knowledge of Nigerian financial systems"
    },
    {
      name: "Code circle foundation",
      role: "Head of Development",
      image: "https://codecircle.com.ng/logo2.png",
      bio: "Co-developement process specialist and backend security expert"
    },
    {
      name: "Otika Nelson Somtochukwu",
      role: "Chief Technical Manager",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQEwJVzp2GuFng/profile-displayphoto-scale_400_400/B4EZ3CDeuuIAAg-/0/1777077186386?e=1778716800&v=beta&t=5I9Bu_QLtorJHco7fx7JYTnyMP2q2dMQYhTfc3qoXE4",
      bio: "Technical developments expert with gross knowledge on Mobile processes and systems"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-6">
            About AjoSave
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing traditional community saving (Ajo) for the digital age, 
            making it safer, more transparent, and accessible to all Nigerians.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-deepBlue-800 mb-4">Our Mission</h2>
              <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
                To democratize access to financial services and empower every Nigerian to build 
                wealth through community-driven saving solutions that are secure, transparent, and rewarding.
              </p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-deepBlue-600 font-medium">
                  "Financial inclusion for all Nigerians, one community at a time."
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://plus.unsplash.com/premium_photo-1733317391601-b1651d6d4be9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGZpbnRlY2h8ZW58MHx8MHx8fDA%3D" 
                alt="Team collaboration" 
                className="rounded-xl shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {value.icon}
                  <h3 className="text-xl font-semibold text-deepBlue-800 ml-3">
                    {value.title}
                  </h3>
                </div>
                <p className="text-deepBlue-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 border border-deepBlue-100">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              AjoSave was born from a simple observation: traditional Ajo (community saving) has helped 
              millions of Nigerians save money for generations, but it lacked the security, transparency, 
              and convenience that modern savers deserve.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              Founded in 2023 by a team of fintech veterans and community saving enthusiasts, we set out 
              to digitize this time-tested savings method while preserving its community spirit and 
              adding layers of security and transparency.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed">
              Today, we're proud to serve thousands of savers across Nigeria, helping them achieve their 
              financial goals through our secure, regulated, and user-friendly platform.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-deepBlue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-deepBlue-500 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-deepBlue-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">AjoSave by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-deepBlue-200">Active Savers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">₦2B+</div>
              <div className="text-deepBlue-200">Total Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-deepBlue-200">Active Groups</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-deepBlue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default About;