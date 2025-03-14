// components/ThankYou.js
import { CheckCircle } from "lucide-react";
// import Link from 'next/link'; // Import Link from next/link

function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank You!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Your feedback has been successfully submitted.
          </p>
          <p className="text-gray-600">
            We appreciate you taking the time to help us improve.
          </p>
        </div>
        <div className="text-center">
          {/* Use Link for navigation */}
            {/* <a href="/">
            <span
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Go Back to Home
            </span>
            </a> */}
        </div>
      </div>
    </div>
  );
}

export default ThankYou;