import { Input } from '@/components/ui/input';
import { useState, useContext, useEffect } from 'react';
import {
  SelectBudgetOptions,
  SelectTravelesList,
  buildTravelPrompt,
} from '../constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GetData } from '../services/AiModal';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiMapPin, FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi';
import { testBackendConnection } from '../utils/googleAuthHelper';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BASE_URL from '../utils/config';
import GoogleLoginButton from '../components/ui/GoogleLoginButton';

export default function CreateTrip() {
  const dataName = {
    days: 'noOfDays',
    place: 'location',
    budget: 'budget',
    travellers: 'noOfTravellers',
  };
  const [days, setDays] = useState('');
  const [formData, setFormData] = useState([]);
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const navigate = useNavigate();
  const { user, token, dispatch } = useContext(AuthContext);
  useEffect(() => {    // Update completed steps when form data changes
    const completed = {};
    if (formData[dataName.place]) {
      completed[1] = true;
    }
    if (formData[dataName.days]) {
      completed[2] = true;
    }
    if (formData[dataName.budget]) {
      completed[3] = true;
    }
    if (formData[dataName.travellers]) {
      completed[4] = true;
    }
    setCompletedSteps(completed);
  }, [formData, dataName.place, dataName.days, dataName.budget, dataName.travellers]);

  const handleChange = e => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setDays(newValue);
      handleInputChange(`${dataName.days}`, newValue);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };  const onGenerateClick = async () => {
    // Check for authentication - try to use context token first, then localStorage as fallback
    const authToken = token || localStorage.getItem('token');
    const userData = user || JSON.parse(localStorage.getItem('user') || 'null');
    
    // Log auth state for debugging
    console.log('Authentication check:', {
      contextToken: !!token,
      localStorageToken: !!localStorage.getItem('token'),
      contextUser: !!user,
      localStorageUser: !!userData
    });
    
    if (!userData || !authToken) {
      console.log('User authentication required');
      setOpenDailog(true);
      toast.info('Please login first');
      return;
    }

    switch (true) {
      case !formData[dataName.days]:
        toast.info('Please enter number of days');
        setCurrentStep(2);
        return;
      case formData[dataName.days] > 15:
        toast.info('Days should be less than 15.');
        setCurrentStep(2);
        return;
      case !formData[dataName.place]:
        toast.info('Please enter destination');
        setCurrentStep(1);
        return;
      case !formData[dataName.budget]:
        toast.info('Please select your budget');
        setCurrentStep(3);
        return;
      case !formData[dataName.travellers]:
        toast.info('Please select who you are traveling with');
        setCurrentStep(4);
        return;
    }    setLoading(true);
    
    // Make sure we're using the most up-to-date token and user data
    const currentToken = token || localStorage.getItem('token');
    const currentUser = user || JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!currentToken) {
      console.error('Authentication token missing when trying to generate trip');
      toast.error('Authentication token is missing. Please login again.');
      setOpenDailog(true);
      setLoading(false);
      return;
    }
    
    if (!currentUser) {
      console.error('User data missing when trying to generate trip');
      toast.error('User information is missing. Please login again.');
      setOpenDailog(true);
      setLoading(false);
      return;
    }
    
    // Connection test before generating trip
    const connectionTest = await testBackendConnection();
    if (!connectionTest.success) {
      console.error('Backend connection failed before trip generation:', connectionTest);
      toast.error(`Cannot connect to server: ${connectionTest.message}`);
      setLoading(false);
      return;
    }
    
    const final_prompt = buildTravelPrompt({
      location: formData[dataName.place],
      days: formData[dataName.days],
      groupType: formData[dataName.travellers],
      budgetLevel: formData[dataName.budget],
    });

    try {
      const res = await GetData(final_prompt);
      if (res) {
        saveTrip(res);
      } else {
        throw new Error('Failed to generate trip data');
      }
    } catch (error) {
      console.error('Error generating trip:', error);
      toast.error('Failed to generate trip. Please try again.');
      setLoading(false);
    }
  };  const saveTrip = async (tripData) => {
    try {
      // Use token from context or localStorage as fallback
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      console.log('Saving trip to backend...');
      
      // Check if data is already in JSON format
      let parsedTripData;
      if (typeof tripData === 'string') {
        try {
          // Clean the string in case it has any extraneous characters
          const cleanedData = tripData.trim();
          console.log('Trip data type:', typeof cleanedData);
          console.log('Trip data preview:', cleanedData.substring(0, 100) + '...');
          
          parsedTripData = JSON.parse(cleanedData);
        } catch (parseError) {
          console.error('Error parsing trip data:', parseError);
          console.error('Trip data causing error:', tripData.substring(0, 200) + '...');
          throw new Error('Invalid trip data format. Please try again.');
        }
      } else {
        // If already an object, use as is
        parsedTripData = tripData;
      }
      
      const payload = {
        location: formData[dataName.place],
        noOfDays: parseInt(formData[dataName.days]),
        budget: formData[dataName.budget],
        noOfTravellers: formData[dataName.travellers],
        tripData: parsedTripData,
      };
      
      console.log('Trip payload prepared:', {
        location: payload.location,
        days: payload.noOfDays,
        hasValidTripData: !!parsedTripData
      });
        // Check backend connection before saving
      const connectionTest = await testBackendConnection();
      if (!connectionTest.success) {
        console.error('Backend connection failed before saving trip:', connectionTest);
        throw new Error(`Cannot connect to server: ${connectionTest.message}`);
      }
        console.log('Sending trip data to server at:', `${BASE_URL}/trips`);
      
      const response = await fetch(`${BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      
      // Check response status before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || `Server error: ${response.status}`;
        } catch (e) {
          errorMessage = `Server error: ${response.status}: ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      console.log('Trip saved successfully:', result);
      toast.success('Trip created successfully!');
      
      // Navigate to the view trip page
      navigate(`/view-trip/${result.data._id}`);
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error(error.message || 'Failed to save trip. Please try again.');
      
      // If there's an authentication error, show the login dialog
      if (error.message.toLowerCase().includes('authentication') || 
          error.message.toLowerCase().includes('token') ||
          error.message.toLowerCase().includes('unauthorized')) {
        setOpenDailog(true);
      }
    } finally {
      setLoading(false);
    }
  };// We've moved the Google login functionality to the GoogleLoginButton component

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Plan Your Dream Adventure ✨
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Tell us your preferences and our AI will craft the perfect itinerary tailored just for you
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-10 px-6 relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}></div>
          {/* Active line that grows with each step */}
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500" 
            style={{ width: `${(currentStep - 1) * 33.33}%`, zIndex: 1 }}
          ></div>
          
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentStep(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  completedSteps[step] 
                    ? 'bg-green-500 text-white shadow-md shadow-green-200' 
                    : currentStep === step 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {completedSteps[step] ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >✓</motion.span>
                ) : step}
              </motion.div>
              <div className={`text-xs mt-2 font-medium ${currentStep === step ? 'text-indigo-600' : 'text-gray-500'}`}>
                {step === 1 ? 'Destination' : step === 2 ? 'Duration' : step === 3 ? 'Budget' : 'Travelers'}
              </div>
            </div>
          ))}
        </div>

        <motion.div 
          key={currentStep}
          initial="hidden"
          animate="visible"
          variants={stepVariants}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-indigo-700 mb-6">
                <FiMapPin /> <span>Where to?</span>
              </div>              <label className="text-lg font-medium text-gray-700 block mb-2">
                What&apos;s your dream destination?
              </label>
              <Input
                placeholder="e.g. Paris, Bali, Tokyo"
                onChange={e => handleInputChange(`${dataName.place}`, e.target.value)}
                value={formData[dataName.place] || ''}
                className="text-lg p-6 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-10 flex justify-between">
                <div></div>
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData[dataName.place]}
                  className="px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-lg transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-indigo-700 mb-6">
                <FiCalendar /> <span>How long?</span>
              </div>
              <label className="text-lg font-medium text-gray-700 block mb-2">
                How many days would you like to explore?
              </label>
              <Input
                placeholder="e.g. 5"
                onChange={handleChange}
                value={days}
                type="text"
                className="text-lg p-6 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm text-gray-500">Maximum 15 days recommended for best results</p>
              <div className="mt-10 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData[dataName.days]}
                  className="px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-lg transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-indigo-700 mb-6">
                <FiDollarSign /> <span>What&apos;s your budget?</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SelectBudgetOptions.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange(`${dataName.budget}`, item.title)}
                    className={`flex flex-col p-6 border rounded-xl cursor-pointer transition-all duration-300
                    ${
                      item.title === formData[dataName.budget]
                        ? 'bg-indigo-50 border-indigo-500 shadow-md'
                        : 'hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)}
                  disabled={!formData[dataName.budget]}
                  className="px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-lg transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-indigo-700 mb-6">
                <FiUsers /> <span>Who&apos;s joining?</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SelectTravelesList.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange(`${dataName.travellers}`, item.people)}
                    className={`flex flex-col p-6 border rounded-xl cursor-pointer transition-all duration-300
                    ${
                      item.people === formData[dataName.travellers]
                        ? 'bg-indigo-50 border-indigo-500 shadow-md'
                        : 'hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </Button>
                <Button
                  onClick={onGenerateClick}
                  disabled={loading || !formData[dataName.travellers]}
                  className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg rounded-lg transition-all hover:opacity-90 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                      <span>Creating Your Trip...</span>
                    </div>
                  ) : (
                    'Create My Perfect Trip'
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Trip Summary Card */}
        {Object.keys(completedSteps).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-white rounded-xl shadow-md border border-indigo-100 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs">✓</span>
              Your Trip Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData[dataName.place] && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-600 font-semibold uppercase">Destination</p>
                  <p className="font-medium text-gray-800">{formData[dataName.place]}</p>
                </div>
              )}
              {formData[dataName.days] && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-semibold uppercase">Duration</p>
                  <p className="font-medium text-gray-800">{formData[dataName.days]} days</p>
                </div>
              )}
              {formData[dataName.budget] && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold uppercase">Budget</p>
                  <p className="font-medium text-gray-800">{formData[dataName.budget]}</p>
                </div>
              )}
              {formData[dataName.travellers] && (
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-xs text-teal-600 font-semibold uppercase">Travelers</p>
                  <p className="font-medium text-gray-800">{formData[dataName.travellers]}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-w-sm rounded-xl p-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
          <DialogHeader className="text-center p-6 pb-2">
            <DialogTitle className="text-2xl font-bold mb-2 text-indigo-700">
              Let&apos;s Get Started
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <img src="/logo3.png" alt="App Logo" className="h-14 w-14" />
              </div>
              <p className="text-gray-600">Sign in to create and save your personalized trip itinerary</p>              <GoogleLoginButton 
                onLoginSuccess={() => {
                  setOpenDailog(false);
                  setTimeout(() => {
                    onGenerateClick();
                  }, 500);
                }} 
                dispatch={dispatch}
              />
              <div className="text-sm text-gray-500 pt-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
