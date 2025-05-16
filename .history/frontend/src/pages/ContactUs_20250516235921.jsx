import { useState } from 'react';
import Joi from 'joi';
import { toast } from 'react-toastify';
import { EnhancedForm } from '../components/forms';
import BASE_URL from '../utils/config';

// Contact form validation schema
const contactSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should be at least 2 characters',
      'string.max': 'Name should not exceed 50 characters'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    }),
  message: Joi.string()
    .required()
    .min(20)
    .max(1000)
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message should be at least 20 characters',
      'string.max': 'Message should not exceed 1000 characters'
    })
});

function Contact() {
  const [isLoading, setIsLoading] = useState(false);

  // Field configurations for the form
  const formFields = [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Your full name',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Write your message here...',
      required: true,
      props: {
        rows: 5
      }
    }
  ];

  const initialValues = {
    name: '',
    email: '',
    message: ''
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Replace with your actual API call when ready
      console.log('Form Data Submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Example: const response = await fetch(`${BASE_URL}/contact`, { method: 'POST', body: JSON.stringify(formData) });
      // if (!response.ok) throw new Error('Submission failed');

      toast.success('Message sent successfully! We&apos;ll get back to you soon.');
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
          Contact & Support
        </h1>

        <p className="text-center text-gray-700 mb-10">
          We're here to help! Whether you have questions about our services,
          need support, or just want to say hello, feel free to reach out.
        </p>
        <div className="flex flex-col md:flex-row md:space-x-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 mb-3">
              <strong>Address:</strong> 1234 React Lane, Suite 100, Web City, WC
              56789
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Phone:</strong> (123) 456-7890
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Email:</strong> support@reactsite.com
            </p>
            <p className="text-gray-700">
              Our support team is available Monday through Friday, 9am to 6pm.
            </p>
          </div>          <div className="md:w-1/2 bg-indigo-50 rounded-lg p-6 shadow-inner">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
              Send us a message
            </h2>
            
            <EnhancedForm 
              schema={contactSchema}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              fields={formFields}
              submitButton="Send Message"
              loadingText="Sending..."
              isLoading={isLoading}
              className="space-y-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
