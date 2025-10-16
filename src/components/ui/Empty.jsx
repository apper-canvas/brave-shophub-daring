import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  message = "Try adjusting your search or filters", 
  actionText = "Browse Products",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-medium"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;