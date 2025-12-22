import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Product } from "../../types";
import * as productService from "../../services/productService";

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService
      .getAllProducts({ limit: 500 })
      .then((response) => {
        setAllProducts(response.items);
      })
      .catch((err) => {
        console.error("Failed to load products for search:", err);
      });
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSuggestionsVisible(false);
  }, [location.pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const filteredSuggestions = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand?.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    navigate(`/products?q=${encodeURIComponent(productName)}`);
    setSearchQuery("");
    setSuggestions([]);
    setIsSuggestionsVisible(false);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsSuggestionsVisible(false);
    }, 150); // Delay to allow click on suggestions
  };

  const navLinkClass =
    "text-gray-700 hover:text-black transition-colors text-sm font-medium";
  const hideCartOnPaths = ["/", "/login", "/register", "/admin/login"];
  const shouldShowCart = !hideCartOnPaths.includes(location.pathname);

  const SearchFormComponent = () => (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (suggestions.length > 0) setIsSuggestionsVisible(true);
            }}
            onBlur={handleBlur}
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
      {isSuggestionsVisible && suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg z-50 overflow-hidden border">
          {suggestions.map((product) => (
            <li key={product.id}>
              <button
                onClick={() => handleSuggestionClick(product.name)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-8 h-10 object-cover rounded flex-shrink-0"
                />
                <span className="text-sm truncate">{product.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={(e) => handleSearchSubmit(e)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 font-semibold text-sm text-center"
            >
              Search for "{searchQuery}"
            </button>
          </li>
        </ul>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home">
            <img
              src="/images/logo.svg"
              alt="oldmarket"
              className="cursor-pointer w-auto h-11"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/home" className={navLinkClass}>
              Home
            </Link>
            <Link to="/products" className={navLinkClass}>
              All Products
            </Link>
            <Link to="/new-arrival" className={navLinkClass}>
              New Arrival
            </Link>
            <Link to="/top-selling" className={navLinkClass}>
              Top Selling
            </Link>
            {user && !isAdmin && (
              <Link to="/recommendations" className={navLinkClass}>
                For You
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <SearchFormComponent />
          </div>

          {/* Right Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              {shouldShowCart && (
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-black"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalItemCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-gray-700 hover:text-black"
                    aria-label="User Menu"
                  >
                    <User className="w-6 h-6" />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform origin-top-right ${
                      isUserMenuOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as{" "}
                      <strong className="block">{user.name}</strong>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={14} /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/"
                  className="text-gray-700 hover:text-black"
                  aria-label="Login"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>

            {/* Mobile-only Cart and Menu Toggler */}
            <div className="lg:hidden flex items-center space-x-4">
              {shouldShowCart && (
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-black"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalItemCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-black"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <SearchFormComponent />

              <div className="flex flex-col space-y-2">
                <Link
                  to="/home"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/new-arrival"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Arrival
                </Link>
                <Link
                  to="/top-selling"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Selling
                </Link>
                {user && !isAdmin && (
                  <Link
                    to="/recommendations"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    For You
                  </Link>
                )}
              </div>

              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 py-2 text-base font-medium text-gray-700 hover:text-black"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User />
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 py-2 text-base font-medium text-gray-700 hover:text-black"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left py-2 text-base font-medium text-red-600"
                    >
                      <LogOut />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-2 text-base font-medium text-gray-700 hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
