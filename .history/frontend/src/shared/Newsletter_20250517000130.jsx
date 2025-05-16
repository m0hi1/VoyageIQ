import React, { useState } from "react";
import { toast } from "react-toastify";
import { FormInput, FormButton } from "../components/forms";
import useValidation from "../hooks/useValidation";
import { newsletterSchema } from "../utils/validationSchema";
import BASE_URL from "../utils/config";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize validation
  const { errors, touched, validateField, validateAll, touchField } = useValidation(newsletterSchema);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    
    // Validate input as user types
    touchField(name);
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const formData = { email };
    const validation = validateAll(formData);
    
    if (!validation.isValid) {
      // If not valid, show first error message
      toast.error(Object.values(validation.errors)[0]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add your logic here for handling the subscription (e.g., sending the email to your server)
      console.log(`Subscribed with email: ${email}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      // Example with real API:
      // const response = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // if (!response.ok) throw new Error('Subscription failed');
      
      toast.success("Newsletter Subscribed Successfully!");
      // Reset the email input after submission
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="newsletter-container p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Subscribe to Our Newsletter
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-gray-200 font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
            required
            className="px-4 py-2 border text-black border-gray-300 rounded-md mb-4 focus:outline-none focus:border-BaseColor"
          />
          <button type="submit" className="btn">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
