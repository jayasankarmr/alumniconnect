import React from 'react';
import { Shield, Eye, Lock, UserCheck, FileText, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Privacy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: `
        <p>We collect information you provide directly to us, such as:</p>
        <ul>
          <li>Account information (name, email, graduation details)</li>
          <li>Profile information (bio, skills, employment details)</li>
          <li>Communications with us and other users</li>
          <li>Event registrations and participation data</li>
          <li>Donation and payment information</li>
        </ul>
        <p>We also automatically collect certain information about your device and usage patterns.</p>
      `,
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices and support messages</li>
          <li>Facilitate networking and mentorship connections</li>
          <li>Communicate about events, opportunities, and announcements</li>
          <li>Monitor and analyze trends and usage</li>
        </ul>
      `,
    },
    {
      icon: UserCheck,
      title: 'Information Sharing and Disclosure',
      content: `
        <p>We may share your information in the following situations:</p>
        <ul>
          <li><strong>With other alumni:</strong> Based on your privacy settings</li>
          <li><strong>With service providers:</strong> Who assist in operating our platform</li>
          <li><strong>For legal compliance:</strong> When required by law or to protect rights</li>
          <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
          <li><strong>With your consent:</strong> When you explicitly agree to sharing</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      `,
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `
        <p>We implement appropriate security measures to protect your information:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication procedures</li>
          <li>Employee training on data protection practices</li>
          <li>Incident response procedures for security breaches</li>
        </ul>
        <p>While we strive to protect your information, no method of transmission over the Internet is 100% secure.</p>
      `,
    },
    {
      icon: Lock,
      title: 'Your Privacy Rights',
      content: `
        <p>You have several rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request copies of your personal data</li>
          <li><strong>Correction:</strong> Request correction of inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        </ul>
        <p>Contact us to exercise these rights or if you have any questions about your data.</p>
      `,
    },
    {
      icon: Clock,
      title: 'Data Retention',
      content: `
        <p>We retain your information for as long as necessary to:</p>
        <ul>
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Support business operations and continuity</li>
        </ul>
        <p>When you delete your account, we will delete or anonymize your information, except as required for legal compliance or legitimate business purposes.</p>
      `,
    },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your information on Alumni Connect.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  Alumni Connect ("we," "our," or "us") is committed to protecting your privacy and personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our alumni networking platform and related services.
                </p>
                <p>
                  By using our services, you consent to the collection and use of your information as described in this policy. 
                  If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Privacy Sections */}
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

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Content className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Contact Us About Privacy
              </h2>
              <div className="text-center">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy, your data, or our privacy practices, 
                  please contact us using the information below:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Email:</p>
                    <p className="text-blue-600">privacy@alumniconnect.edu</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Postal Address:</p>
                    <div className="text-gray-700">
                      <p>Alumni Connect - Privacy Officer</p>
                      <p>123 University Avenue</p>
                      <p>Education City, EC 12345</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Phone:</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 
                    30 days of receipt. For urgent matters, please call our main number.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Content className="p-8">
              <h2  className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. When we make changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Update the "Last Updated" date at the top of this policy</li>
                  <li>Notify you via email if the changes are significant</li>
                  <li>Post a notice on our platform highlighting the changes</li>
                  <li>Provide a summary of key changes when appropriate</li>
                </ul>
                <p>
                  Your continued use of our services after any changes to this Privacy Policy constitutes 
                  your acceptance of such changes.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Privacy;