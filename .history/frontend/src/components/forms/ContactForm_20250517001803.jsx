import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ValidatedForm } from './index';
import BASE_URL from '../../utils/config';
import { contactSchema, validateContact } from '../../utils/validationSchema';

// Initial form values
const initialValues = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Field configurations for the form
  const fields = [
    {
      name: 'name',
      label: 'Your Name',
      placeholder: 'John Doe',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true
    },
    {
      name: 'subject',
      label: 'Subject',
      placeholder: 'How can we help you?',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Please describe your inquiry in detail...',
      required: true,
      props: {
        rows: 4
      }
    }
  ];

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Send the contact form data to the backend
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      // Show success message
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.');
      
      // Form will be reset automatically by the ValidatedForm component
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Us</h2>
      
      <ValidatedForm
        schema={contactSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        submitButton="Send Message"
        loadingText="Sending..."
        isLoading={isLoading}
        className="space-y-4"
      />
    </div>
  );
};

export default ContactForm;
