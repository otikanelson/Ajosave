import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, TrendingUp, ArrowRight, CheckCircle, Star, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import HomeNavbar from '../components/layout/HomeNavbar'
import HomeFooter from '../components/layout/HomeFooter'
import logo from '../assets/images/logo.png'
import heroImage from '../assets/images/vitaly-gariev-uFF_apyZ-l8-unsplash.jpg'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  const features = [
    {
      icon: <Users className="w-8 h-8 text-green-400 rounded" />,
      title: "Join Trusted Groups",
      description: "Save with Verified Community Members",
      highlight: "1000+ Active Groups"
    },
    {
      icon: <Shield className="w-8 h-8 text-deepBlue-600" />,
      title: "Secure and Transparent",
      description: "All Transactions are tracked and Verified",
      highlight: "Bank-Level Security"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Grow your Savings",
      description: "Disciplined Saving with regular payout",
      highlight: "Average 15% Growth"
    }
  ]

  const testimonials = [
    {
      name: "Adunni O.",
      text: "The AjoSave Plaftorm hsa helped me save ₦500,000 in 6 months. The group system keeps me accountable!",
      rating: 5,
      image: "https://atodmagazine.com/wp-content/uploads/2021/02/Nigeria-1050x700.jpg"
    },
    {
      name: "Fatima A.",
      text: "Finally, A completely transparent and secure way to do group Ajo savings.",
      rating: 5,
      image: "https://www.nairaland.com/attachments/5371101_powedelawrence2_jpeg1362db864dd226c579514032448f5f8f"
    },
    {
      name: "Chidi M.",
      text: "The best way to save with friends and family. Highly recommended!",
      rating: 5,
      image: "https://media.istockphoto.com/id/517302398/photo/portrait-of-nigerian-man-with-beard-looking-at-camera.jpg?s=612x612&w=0&k=20&c=BC5pdsmTWzmFO3mIlA7TQAIECnJ7Kpd-daL6G4RJqT4="
}
  ]

  // Handle session management and redirects
  useEffect(() => {
    if (isAuthenticated && user) {
      // Show welcome back message briefly before redirecting
      setShowWelcomeBack(true)
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 2000) // 2 second delay to show welcome message
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, navigate])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600 mx-auto mb-4"></div>
          <p className="text-deepBlue-600 font-medium">Loading AjoSave...</p>
        </div>
      </div>
    )
  }

  // Show welcome back message for returning users
  if (showWelcomeBack && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-deepBlue-600 mb-4">
            Redirecting you to your dashboard...
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-deepBlue-200 rounded-full">
              <div className="h-2 bg-deepBlue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleGetStarted = () => {
    // If not authenticated, go to auth page
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-deepBlue-800 mb-6 leading-tight">
                Your Money's
                <span className="text-deepBlue-600 block">Safe Space</span>
              </h1>
              
              <p className="text-xl text-deepBlue-600 mb-8 leading-relaxed">
                Digital Community Saving Made Simple, Secure, and Rewarding. 
                Join thousands of Nigerians building their financial future together.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-deepBlue-700 font-medium">Licensed by CBN</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-deepBlue-700 font-medium">NDIC Insured</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-deepBlue-700 font-medium">Bank-Level Security</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-deepBlue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-deepBlue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="flex items-center justify-center space-x-2 text-deepBlue-600 hover:text-deepBlue-800 font-medium px-6 py-4 transition-colors">
                  <Play className="w-5 h-5" />
                  <span>Watch How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImage}
                  alt="African businesspeople discussing financial planning and savings" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                {/* Floating Stats Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-deepBlue-800">₦2B+</div>
                  <div className="text-sm text-deepBlue-600">Total Saved</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">10K+</div>
                  <div className="text-sm text-deepBlue-600">Happy Savers</div>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-deepBlue-200 to-purple-200 rounded-2xl transform rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-12 border-b border-deepBlue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">Trusted by Leading Institutions</h2>
            <p className="text-deepBlue-600">Regulated and secured by Nigeria's top financial authorities</p>
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-sm font-medium text-deepBlue-700">CBN Licensed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-deepBlue-700">NDIC Insured</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-deepBlue-700">ISO Certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
            Why Choose AjoSave?
          </h2>
          <p className="text-xl text-deepBlue-600 max-w-2xl mx-auto">
            Experience the future of community saving with our secure, transparent, and rewarding platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group border border-deepBlue-100">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-deepBlue-600 mb-4">{feature.description}</p>
              <div className="inline-block bg-deepBlue-50 text-deepBlue-700 px-3 py-1 rounded-full text-sm font-medium">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-deepBlue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-deepBlue-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Sign Up", desc: "Create your account and verify your identity", icon: "👤" },
              { step: 2, title: "Join Group", desc: "Browse and join a savings group that fits your goals", icon: "👥" },
              { step: 3, title: "Save Together", desc: "Make regular contributions with your group members", icon: "💰" },
              { step: 4, title: "Get Paid", desc: "Receive your payout when it's your turn", icon: "🎉" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-deepBlue-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-deepBlue-600">
            Real stories from real savers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-deepBlue-700 mb-6 italic text-lg">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-deepBlue-800">{testimonial.name}</p>
                  <p className="text-deepBlue-500 text-sm">Verified Saver</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-deepBlue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-deepBlue-200">Active Savers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">₦2B+</div>
              <div className="text-deepBlue-200">Total Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-deepBlue-200">Active Groups</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-deepBlue-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of Nigerians who are building their financial future with AjoSave. 
            Start your savings journey today and watch your money grow!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-deepBlue-600 px-10 py-4 rounded-full font-semibold hover:bg-deepBlue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started Today
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-deepBlue-600 transition-all duration-200"
            >
              Learn More
            </button>
          </div>
          <p className="text-deepBlue-200 text-sm mt-6">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => navigate('/terms-conditions')}
              className="underline hover:text-white"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              onClick={() => navigate('/privacy-policy')}
              className="underline hover:text-white"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}

export default Home
