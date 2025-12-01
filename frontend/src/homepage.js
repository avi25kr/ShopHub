import React, { useState, useEffect } from 'react';
import { User, ShoppingCart, Search, Filter, Star, LogOut, Menu, X , Heart} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import OrdersView from "./checkout";
import axios from "axios";

function SearchBox({ searchTerm, setSearchTerm }) {
  const [localValue, setLocalValue] = useState(searchTerm);

  const handleSearch = () => {
    setSearchTerm(localValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    // This is actually Option 1: Auto-clear on backspace when empty
    if (e.key === 'Backspace' && localValue === '' && searchTerm !== '') {
      setSearchTerm('');
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // This is actually Option 2: Auto-clear when input becomes empty (immediate)
    if (newValue === '' && searchTerm !== '') {
      setSearchTerm('');
    }
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchTerm('');
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search products, brands, or categories..."
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      />
      
      {/* Search Icon (left side) */}
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
      
      {/* Action buttons (right side) */}
      <div className="absolute right-2 flex items-center gap-1">
        {localValue && (
          <button
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleSearch}
          className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


const PostLoginDashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [recs, setRecs] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentView, setCurrentView] = useState('products'); // 'products' or 'profile'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');

  // const handleSearch = () => {
  //   setSearchTerm(pendingSearchTerm); // only update on button click or Enter
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     handleSearch();
  //   }
  // };


  // Calculate indexes
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Slice products
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const navigate = useNavigate(); // 

  const API_BASE = 'https://shophub-oc39.onrender.com';
  const token = localStorage.getItem('token');

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    }
    setLoading(false);
  };

  // const fetchRecommendations = async () => {
  //   // if (!user) return;
  //   try {
  //     const response = await fetch(`${API_BASE}/recommendations`, {
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setRecs(data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch recommendations');
  //   }
  // };

  // Filter products based on search and category

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      console.error("Saved cart:", savedCart);
      setCart(savedCart);
      setWishlist(savedWishlist);
      setOrders(savedOrders);
    }
  }, []);


  // Cart functions
    const saveCart = async (newCart) => {
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.post(
          `${API_BASE}/cart`,
          { cart: newCart },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };

    const saveWishlist = async (newWishlist) => {
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.post(
          `${API_BASE}/wishlist`,
          { wishlist: newWishlist },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving wishlist:", err);
      }
    };

    const saveOrders = async (newOrders) => {
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));
      console.log("Saving orders:", newOrders);
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.post(
          `${API_BASE}/orders`,
          { orders: newOrders },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving orders:", err);
      }
    };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      saveCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      saveCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item._id === product._id)){
      saveWishlist(wishlist.filter(item => item._id !== product._id));
    } else {
      saveWishlist([...wishlist, product]);
    }
  };



  const removeFromCart = (productId) => {
    saveCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCategories = () => {
    return [...new Set(products.map(product => product.category))];
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('orders');

    window.location.reload(); // Redirect to login
  };

  // Load data on component mount
  useEffect(() => {
    fetchProfile();
    fetchProducts();
    // fetchRecommendations();
  }, []);
  useEffect(() => {
    fetch(`https://shophub-oc39.onrender.com/recommendations`, {headers: {'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(data => {
   
        setRecs(data.recommendations || []);
      });
  }, []);
  console.error("Recommendations:", recs);

  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

 

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ShoppingCart className="text-indigo-600 w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">ShopHub</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('products')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'products' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'profile' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* login  page button */}
          {!localStorage.getItem("token") && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'login' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Login
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'wishlist' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Wishlist
            </button>
          </div>

          <div className="flex items-right space-x-4">
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm text-gray-700">
                {user?.name || 'User'}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
            
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('products');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Products
              </button>
              <button
                onClick={() => {
                  setCurrentView('profile');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setCurrentView('cart');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  // Products View
    // Products View
  const ProductsView = () => {
      

    return(


    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Products</h2>
        <p className="text-gray-600">Discover our amazing collection</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-600 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[150px]"
          >
            <option value="">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {/* Products Grid */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => {
              const isLiked = wishlist.some(item => item._id === product._id);

              return (
                <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3 flex justify-between items-start">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {product.brand}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${product.price}
                      </span>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button onClick={() => toggleWishlist(product)} className="p-2 hover:scale-110 transition-transform duration-200">
                        <Heart
                          size={24}
                          color={isLiked ? "red" : "gray"}
                          fill={isLiked ? "red" : "none"}
                        />
                      </button>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-6">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg text-sm ${
                  currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
          

          {/* Recommendations */}
          {recs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recs.map(product => {
                  const isLiked = wishlist.some(item => item._id === product._id);

                  return (
                    <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';
                          }}
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-3 flex justify-between items-start">
                          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            {product.brand}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">4.5</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-indigo-600">
                            ${product.price}
                          </span>
                          
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                          <button onClick={() => toggleWishlist(product)} className="p-2 hover:scale-110 transition-transform duration-200">
                            <Heart
                              size={24}
                              color={isLiked ? "red" : "gray"}
                              fill={isLiked ? "red" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* No products found */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};


  // Profile View
  const ProfileView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mt-2">
              Active Member
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-900">{orders.length}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items in Cart</span>
                  <span className="font-semibold text-gray-900">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cart Value</span>
                  <span className="font-semibold text-gray-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Cart View
  const CartView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-gray-600">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => setCurrentView('products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image';
                  }}
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  <p className="text-lg font-semibold text-indigo-600">${item.price}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('products')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  // Save current cart as new order
                  //const newOrder = [...cart]; // copy cart items
                  //localStorage.setItem("currentOrder", JSON.stringify(newOrder));
                  //navigate("/checkout");
                  // const updatedOrders = [...orders, ...newOrder]; // append to previous orders

                  // saveOrders(updatedOrders); // save to localStorage + backend
                  //setOrder(newOrder);        // set current order for checkout page
                  setCurrentView('checkout'); // navigate to checkout
                }}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Checkout
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );

  const wishlistView = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-medium text-gray-900 mb-4">Your Wishlist</h3>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map(item => (
            <li key={item._id} className="flex items-center space-x-4">
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image';
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.brand}</p>
                <p className="text-lg font-semibold text-indigo-600">${item.price}</p>
              </div>
              <button
                onClick={() => toggleWishlist(item)}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );


  


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentView === 'products' && <ProductsView />}
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'cart' && <CartView />}
      {currentView === 'wishlist' && wishlistView()}
      {currentView === "checkout" && (
        <OrdersView
          cart={cart}
          setCart={setCart}
          orders={orders}
          setOrders={setOrders}
          saveOrders={saveOrders}
          setCurrentView={setCurrentView}
          saveCart={saveCart}
        />
      )}

      {/* Footer */}
    </div>
  );
};

export default PostLoginDashboard;