function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg max-w-3xl p-10">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
          Privacy Policy
        </h1>
        <div className="flex justify-center ">
          <img src="/icon.png" className="logo text-3xl" alt="App logo" />
        </div>
        <div className="text-center mb-4">
          <h1>VoyageIQ</h1>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Your privacy is important to us. We are committed to protecting your
          personal information and your right to privacy.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          When you use our services, you trust us with your information. We take
          your privacy seriously and only collect data necessary to provide and
          improve our services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4 leading-relaxed">
          <li>
            Personal identification information (Name, email address, phone
            number, etc.)
          </li>
          <li>Usage data and cookies to improve your experience</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We use your information to provide, maintain, and improve our
          services, communicate with you, and ensure security.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Your Rights
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          You have the right to access, update, or delete your personal
          information. You can also opt out of marketing communications at any
          time.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </div>
    </div>
  );
}

export default Privacy;
