import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
const Header = ({ cartItemCount = 0, compareItemsCount = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    "Electronics",
    "Fashion",
    "Books", 
    "Home & Garden", 
    "Sports", 
    "Beauty", 
    "Automotive", 
    "Toys"
  ];

  const handleCompareClick = () => {
    navigate("/compare");
  };

const handleLogout = async () => {
    try {
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/login");
      await window.ApperSDK?.ApperUI?.logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}>
                <div
                    className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <ApperIcon name="ShoppingBag" size={20} className="text-white" />
                </div>
<h1 className="text-xl font-bold">ShopHub</h1>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
        {/* Auth Section */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
>
              <ApperIcon name="User" size={20} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.firstName || user?.emailAddress?.split('@')[0] || 'User'}
              </span>
              <ApperIcon name="ChevronDown" size={16} className="text-gray-500" />
            </button>
            
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Signed in as</p>
<p className="text-sm font-medium text-gray-900 truncate">
                      {user?.emailAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/order-history");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <ApperIcon name="Package" size={16} />
                    Order History
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <ApperIcon name="LogOut" size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="LogIn" size={20} />
            <span className="hidden sm:inline">Login</span>
          </Button>
        )}

        {/* Compare Button */}
        <button
          onClick={handleCompareClick}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
aria-label="Compare products"
        >
          <ApperIcon name="ArrowLeftRight" size={22} className="text-gray-700" />
          {compareItemsCount > 0 && (
            <Badge 
              content={compareItemsCount > 99 ? "99+" : compareItemsCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Shopping cart"
        >
          <ApperIcon name="ShoppingCart" size={22} className="text-gray-700" />
          {cartItemCount > 0 && (
            <Badge 
              content={cartItemCount > 99 ? "99+" : cartItemCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </button>
{/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <ApperIcon 
            name={isMobileMenuOpen ? "X" : "Menu"} 
            size={24} 
            className="text-gray-700"
          />
        </button>
      </div>
    </div>
{/* Desktop Categories */}
    <div className="hidden md:flex items-center space-x-6 py-3 border-t border-gray-200">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
      >
        All Categories
      </button>
      <button
        onClick={() => navigate("/order-history")}
        className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
      >
        Order History
      </button>
      <button
        onClick={() => navigate("/compare")}
        className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
      >
        Compare Products {compareItemsCount > 0 && `(${compareItemsCount})`}
      </button>
      {categories.slice(0, 5).map(category => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="text-sm text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
        >
          {category}
        </button>
      ))}
    </div>
  </div>
{/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden bg-white border-t border-gray-200">
      {/* Mobile Search */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {/* Mobile Categories */}
      <button
        onClick={() => {
          navigate("/");
          setIsMobileMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium"
      >
        All Categories
      </button>
      <button
        onClick={() => {
          navigate("/order-history");
          setIsMobileMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium"
      >
        Order History
      </button>
      <button
        onClick={() => {
          navigate("/compare");
          setIsMobileMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium"
      >
        Compare Products {compareItemsCount > 0 && `(${compareItemsCount})`}
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  )}
</header>
  );
};

export default Header;