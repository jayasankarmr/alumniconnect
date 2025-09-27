import React from 'react';
import { Users, Target, Heart, Award, Globe, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in the power of strong, supportive communities that help each other succeed.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our platform to our service.',
    },
    {
      icon: Heart,
      title: 'Giving Back',
      description: 'We encourage and facilitate alumni to give back to their alma mater and community.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting alumni worldwide, breaking geographical barriers for meaningful relationships.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Alumni' },
    { number: '50+', label: 'Countries Represented' },
    { number: '1,200+', label: 'Mentorship Connections' },
    { number: '₹2.5Cr+', label: 'Donations Facilitated' },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Director, Alumni Relations',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=300&h=300&fit=crop&crop=face',
      bio: 'Leading alumni engagement initiatives for over 15 years.',
    },
    {
      name: 'Michael Chen',
      role: 'Technology Lead',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=300&h=300&fit=crop&crop=face',
      bio: 'Building innovative solutions to connect our global alumni community.',
    },
    {
      name: 'Priya Patel',
      role: 'Community Manager',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=300&h=300&fit=crop&crop=face',
      bio: 'Fostering meaningful connections and organizing impactful events.',
    },
    {
      name: 'David Rodriguez',
      role: 'Partnerships Director',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=300&h=300&fit=crop&crop=face',
      bio: 'Building strategic partnerships with companies and organizations.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About Alumni Connect
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Empowering alumni to build lasting connections, advance their careers, 
              and make a meaningful impact on their alma mater and community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Alumni Connect is dedicated to creating a vibrant, engaged community of graduates 
                who support each other's professional growth while contributing to the continued 
                success of our institution.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We provide the tools, opportunities, and connections that enable alumni to 
                network effectively, find meaningful career opportunities, give back through 
                mentorship, and stay connected to their alma mater.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=600&h=400&fit=crop"
                alt="Alumni networking event"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the culture of our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <Card.Content className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Numbers that reflect the strength and reach of our alumni community.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals working to make Alumni Connect the best 
              platform for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <Card.Content className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?w=600&h=400&fit=crop"
                alt="University campus"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2020, Alumni Connect emerged from a simple idea: to create 
                  a digital platform that could bridge the gap between graduates and their 
                  alma mater, while fostering meaningful connections among alumni worldwide.
                </p>
                <p>
                  What started as a small initiative has grown into a comprehensive platform 
                  serving thousands of alumni across the globe. We've facilitated countless 
                  career opportunities, mentorship relationships, and community initiatives.
                </p>
                <p>
                  Today, we continue to innovate and expand our offerings, always keeping 
                  our community's needs at the center of everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <BookOpen className="w-16 h-16 mx-auto mb-8 text-blue-200" />
          <h2 className="text-3xl font-bold mb-6">Join Our Story</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Be part of a community that's shaping the future through collaboration, 
            innovation, and shared success.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;