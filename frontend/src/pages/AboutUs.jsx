import logo from '/logo3.png'; // Corrected import

function About() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} className="h-20 w-20 mb-4" alt="App logo" />{' '}
            {/* Adjusted logo size */}
            <h1 className="text-5xl font-bold text-indigo-700">VoyageIQ</h1>
            <p className="text-xl text-gray-600 mt-2">Your AI Trip Planner</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
              About Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              VoyageIQ is a web application designed to revolutionize your
              travel planning experience using the power of Artificial
              Intelligence. Our platform suggests destinations, crafts
              personalized itineraries, and offers insightful travel tips
              tailored to your unique preferences. By leveraging advanced
              machine learning algorithms, VoyageIQ analyzes your input to
              generate bespoke travel recommendations. We integrate with leading
              travel APIs to provide real-time information on flights,
              accommodations, and activities, ensuring your plans are always
              up-to-date. Our focus is on a user-friendly and intuitive
              interface, making it effortless for anyone to plan their dream
              vacation. Whether you seek a tranquil beach escape or an
              exhilarating mountain adventure, VoyageIQ is your trusted
              companion. Embrace the future of travel planning and let our AI do
              the heavy lifting, so you can focus on the excitement of your
              journey.
            </p>
          </div>
        </div>
        <p className="mt-8 text-gray-700 text-center font-medium text-sm">
          Currently in Development
        </p>
      </div>
    </>
  );
}

export default About;
