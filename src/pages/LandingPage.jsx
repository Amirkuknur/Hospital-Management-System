import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHospital, FaUserMd, FaCalendarAlt, FaChartLine, FaUserInjured } from 'react-icons/fa'

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const navigate = useNavigate()

  const features = [
    {
      icon: <FaUserMd className="w-8 h-8 text-blue-500" />,
      title: "Doctor Management",
      description: "Efficiently manage doctor schedules and specializations"
    },
    {
      icon: <FaUserInjured className="w-8 h-8 text-blue-500" />,
      title: "Patient Care",
      description: "Streamlined patient registration and record management"
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 text-blue-500" />,
      title: "Appointment Booking",
      description: "Easy online appointment scheduling system"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-500" />,
      title: "Analytics",
      description: "Comprehensive healthcare analytics and reporting"
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              <FaHospital className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedCare Pro</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <a href="#features" className="nav-link">Features</a>
              <button onClick={() => setShowAbout(true)} className="nav-link">About</button>
              <button onClick={() => setShowContact(true)} className="nav-link">Contact</button>
              <button onClick={() => navigate('/login')} className="btn-primary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn-primary">
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute w-full bg-white border-b border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50">Features</a>
              <button onClick={() => setShowAbout(true)} className="block w-full text-left px-3 py-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50">About</button>
              <button onClick={() => setShowContact(true)} className="block w-full text-left px-3 py-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50">Contact</button>
              <button onClick={() => navigate('/login')} className="block w-full text-left px-3 py-2 bg-blue-500 text-white hover:bg-blue-600">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="block w-full text-left px-3 py-2 bg-blue-500 text-white hover:bg-blue-600">
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
              <button onClick={() => setShowAbout(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              MedCare Pro is a leading healthcare management system provider, dedicated to transforming healthcare delivery through innovative technology solutions. Our platform streamlines hospital operations, enhances patient care, and improves healthcare outcomes.
            </p>
            <p className="text-gray-600">
              Founded in 2024, we serve hundreds of healthcare facilities worldwide, helping them deliver better care more efficiently.
            </p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <button onClick={() => setShowContact(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Get in touch with our support team:
              </p>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@medcarepro.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Image Carousel */}
      <div className="relative overflow-hidden" style={{ height: "700px" }}>
        {/* Image Carousel */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2000"
            alt="Hospital Interior"
            className="slide-image"
          />
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000"
            alt="Medical Technology"
            className="slide-image"
          />
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000"
            alt="Healthcare Team"
            className="slide-image"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent"></div>
        </div>

        <div className="relative h-full pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center h-full">
              <div className="w-full md:w-1/2 text-white">
                <span className="inline-block px-4 py-1 bg-blue-500 bg-opacity-20 rounded-full text-blue-100 text-sm mb-4">
                  Healthcare Innovation
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Modern Healthcare Management Solution
                </h1>
                <p className="text-lg mb-8 max-w-xl text-blue-50">
                  Streamline your hospital operations with our comprehensive management system
                </p>
                <div className="space-x-4">
                  <button onClick={() => navigate('/login')} className="btn-primary">
                    Login
                  </button>
                  <button onClick={() => navigate('/register')} className="btn-secondary">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your healthcare facility efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaHospital className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">MedCare Pro</span>
              </div>
              <p className="text-sm">Transforming healthcare management with innovative solutions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setShowAbout(true)} className="hover:text-white">About</button></li>
                <li><button onClick={() => setShowContact(true)} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 MedCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;