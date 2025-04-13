import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Contact Us</h1>
      
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Get in Touch</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-map-marker-alt text-primary mt-1"></i>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 News Street, Delhi, India</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <i className="fas fa-envelope text-primary mt-1"></i>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">contact@latestnewsmedia.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <i className="fas fa-phone text-primary mt-1"></i>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+91 123 456 7890</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <i className="fas fa-clock text-primary mt-1"></i>
              <div>
                <h3 className="font-semibold">Working Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your message here..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 