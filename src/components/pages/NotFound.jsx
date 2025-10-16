import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" size={48} className="text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500">
            Need help? Try searching for products or browse our categories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;