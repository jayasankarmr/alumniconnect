import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Terms = () => {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: `
        <p>By accessing and using Alumni Connect, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
        <p>These Terms of Service apply to all users of the platform, including alumni, students, faculty, and administrators.</p>
      `,
    },
    {
      icon: FileText,
      title: 'Description of Service',
      content: `
        <p>Alumni Connect is a networking platform designed to:</p>
        <ul>
          <li>Connect alumni with each other and their alma mater</li>
          <li>Facilitate professional networking and mentorship</li>
          <li>Provide access to career opportunities and events</li>
          <li>Enable alumni to contribute to their university community</li>
          <li>Support fundraising and donation activities</li>
        </ul>
        <p>We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.</p>
      `,
    },
    {
      icon: Shield,
      title: 'User Accounts and Responsibilities',
      content: `
        <p>To use our services, you must:</p>
        <ul>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Be responsible for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
          <li>Use the platform in accordance with applicable laws</li>
        </ul>
        <p>You are solely responsible for the content you post and the consequences of sharing that content.</p>
      `,
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Uses',
      content: `
        <p>You may not use Alumni Connect to:</p>
        <ul>
          <li>Post false, misleading, or fraudulent information</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Spam or send unsolicited communications</li>
          <li>Violate intellectual property rights</li>
          <li>Engage in illegal activities or promote illegal content</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use automated tools to access or interact with the platform</li>
        </ul>
        <p>Violation of these terms may result in account suspension or termination.</p>
      `,
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content: `
        <p>Content and intellectual property rights:</p>
        <ul>
          <li><strong>Our Content:</strong> Alumni Connect owns all rights to the platform design, features, and original content</li>
          <li><strong>Your Content:</strong> You retain ownership of content you post but grant us license to use it for platform operations</li>
          <li><strong>User-Generated Content:</strong> Users are responsible for ensuring they have rights to content they share</li>
          <li><strong>Trademarks:</strong> All trademarks and logos are property of their respective owners</li>
        </ul>
        <p>Respect for intellectual property is essential to maintaining our community.</p>
      `,
    },
    {
      icon: Clock,
      title: 'Privacy and Data Protection',
      content: `
        <p>Your privacy is important to us:</p>
        <ul>
          <li>We collect and use information as described in our Privacy Policy</li>
          <li>You control the visibility of your profile information</li>
          <li>We implement security measures to protect your data</li>
          <li>You can request access, correction, or deletion of your data</li>
          <li>We comply with applicable data protection regulations</li>
        </ul>
        <p>Please review our Privacy Policy for detailed information about data handling practices.</p>
      `,
    },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using Alumni Connect. 
              By using our platform, you agree to these terms and conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              <strong>Last Updated:</strong> December 1, 2024
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Effective Date:</strong> December 1, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Content className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Alumni Connect</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  These Terms of Service ("Terms") govern your use of the Alumni Connect platform and services 
                  operated by [University Name] ("we," "us," or "our"). These Terms apply to all visitors, 
                  users, and others who access or use our service.
                </p>
                <p>
                  By accessing or using our service, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, then you may not access the service.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <Card.Content className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h3>
                      <div 
                        className="prose text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Card>
              <Card.Content className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers and Limitations</h2>
                <div className="prose text-gray-700 leading-relaxed">
                  <h4>Service Availability</h4>
                  <p>
                    We strive to maintain high availability but cannot guarantee uninterrupted service. 
                    The platform may be temporarily unavailable due to maintenance, updates, or technical issues.
                  </p>
                  
                  <h4>Content Accuracy</h4>
                  <p>
                    While we encourage accurate information sharing, we cannot verify all user-generated content. 
                    Users are responsible for the accuracy of their profiles and posts.
                  </p>
                  
                  <h4>Third-Party Links</h4>
                  <p>
                    Our platform may contain links to external websites. We are not responsible for the content 
                    or practices of third-party sites.
                  </p>
                  
                  <h4>Limitation of Liability</h4>
                  <p>
                    To the fullest extent permitted by law, Alumni Connect shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising from your use of the platform.
                  </p>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
                <div className="prose text-gray-700 leading-relaxed">
                  <p>
                    We may terminate or suspend your account and access to the service immediately, without prior 
                    notice or liability, for any reason, including breach of these Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the service will cease immediately. If you wish to 
                    terminate your account, you may do so by contacting us or using the account deletion 
                    feature in your settings.
                  </p>
                  <p>
                    All provisions of the Terms which by their nature should survive termination shall survive, 
                    including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
                <div className="prose text-gray-700 leading-relaxed">
                  <p>
                    These Terms shall be interpreted and governed by the laws of [State/Country], without regard 
                    to its conflict of law provisions. Our failure to enforce any right or provision of these 
                    Terms will not be considered a waiver of those rights.
                  </p>
                  <p>
                    Any disputes arising from these Terms or your use of the service will be resolved through 
                    binding arbitration in accordance with the rules of [Arbitration Organization].
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Content className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Questions About These Terms?
              </h2>
              <div className="text-center">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Email:</p>
                    <p className="text-blue-600">legal@alumniconnect.edu</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Postal Address:</p>
                    <div className="text-gray-700">
                      <p>Alumni Connect - Legal Department</p>
                      <p>123 University Avenue</p>
                      <p>Education City, EC 12345</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Phone:</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Content className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="mb-4">
                  What constitutes a material change will be determined at our sole discretion. By continuing 
                  to access or use our service after those revisions become effective, you agree to be bound 
                  by the revised terms.
                </p>
                <p>
                  We encourage you to review these Terms periodically to stay informed of any updates.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Terms;