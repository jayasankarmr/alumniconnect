import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'alumni@university.edu',
      description: 'Send us an email anytime!',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 University Ave, Education City, EC 12345',
      description: 'Alumni Relations Office',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Monday - Friday: 8:00 AM - 5:00 PM',
      description: 'Weekend support via email',
    },
  ];

  const faqs = [
    {
      question: 'How do I update my profile information?',
      answer: 'Log in to your account and go to Settings > Profile to update your information.',
    },
    {
      question: 'How can I become a mentor?',
      answer: 'Visit the Mentorship page and toggle the "Available for Mentorship" option in your profile.',
    },
    {
      question: 'How do I post job opportunities?',
      answer: 'Navigate to the Opportunities page and click "Post Opportunity" to share job openings.',
    },
    {
      question: 'Can I organize alumni events?',
      answer: 'Yes! Contact our team to discuss organizing events in your area.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              We're here to help! Reach out to us with any questions, suggestions, 
              or feedback about Alumni Connect.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center">
                <Card.Content className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <div className="text-blue-600 font-medium mb-2">
                    {info.details}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {info.description}
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <Card>
                <Card.Content className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          id="name"
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          id="email"
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        {...register('subject')}
                        type="text"
                        id="subject"
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message')}
                        id="message"
                        rows={6}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full py-3 text-base font-semibold"
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Send Message
                    </Button>
                  </form>
                </Card.Content>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
              <Card className="mb-8">
                <Card.Content className="p-0">
                  <div className="w-full h-64 bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959362573!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Alumni Relations Office
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Located in the heart of campus, our office is always open 
                      for alumni visiting the university.
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span>123 University Avenue, Education City, EC 12345</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        <span>Monday - Friday: 8:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about Alumni Connect.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Content className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;