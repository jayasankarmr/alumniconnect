import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Heart, 
  ArrowRight, 
  Trophy,
  Globe,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
  const stats = [
    { label: 'Active Alumni', value: '10,000+', icon: Users },
    { label: 'Global Reach', value: '50+ Countries', icon: Globe },
    { label: 'Success Stories', value: '500+', icon: Trophy },
    { label: 'Active Mentors', value: '1,200+', icon: Lightbulb },
  ];

  const features = [
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Connect with fellow graduates from your department, year, or company. Build lasting professional relationships.',
      link: '/alumni',
      color: 'blue',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated with alumni events, workshops, and reunions. Network and learn from industry experts.',
      link: '/events',
      color: 'green',
    },
    {
      icon: Briefcase,
      title: 'Career Opportunities',
      description: 'Discover job openings, internships, and career guidance from successful alumni in your field.',
      link: '/opportunities',
      color: 'purple',
    },
    {
      icon: BookOpen,
      title: 'Mentorship Program',
      description: 'Get guidance from experienced professionals or become a mentor to help the next generation.',
      link: '/mentorship',
      color: 'orange',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      year: '2018',
      quote: 'The mentorship program helped me land my dream job. The connection with senior alumni was invaluable.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      year: '2016',
      quote: 'Alumni Connect opened doors I never knew existed. The network is incredibly supportive and active.',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Priya Sharma',
      role: 'Data Scientist at Meta',
      year: '2019',
      quote: 'From career guidance to lifelong friendships, this platform has been central to my professional growth.',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150&h=150&fit=crop&crop=face'
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/college2.jpg'), url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
              Connect. Grow.{' '}
              <span className="text-blue-200">Succeed Together.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of alumni building meaningful connections, advancing careers, 
              and giving back to their alma mater through our comprehensive platform.
            </p>
            
            {/* Search Input and Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search alumni, companies, or interests..."
                  className="w-full px-6 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <Link to="/alumni">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold rounded-lg"
                >
                  Explore Alumni
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover powerful tools designed to help you network, learn, and contribute 
              to your professional and academic community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="h-full">
                <Card.Content className="p-8">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 p-0">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Stories of Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from alumni who have transformed their careers and lives through 
              meaningful connections and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <Card.Content className="p-8 text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-6 object-cover"
                  />
                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-blue-600">
                      Class of {testimonial.year}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Heart className="w-16 h-16 mx-auto mb-8 text-blue-200" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join our thriving community of alumni who are shaping the future through 
            collaboration, mentorship, and giving back. Your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="ghost" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;