import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h2>
          <p className="text-blue-700 text-sm mb-4">
            If you think this is a mistake, please contact our support team.
          </p>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;