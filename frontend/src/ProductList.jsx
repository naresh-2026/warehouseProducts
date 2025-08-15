import React, { useState, useEffect } from 'react';
import './ProductList.css'; 
import { useLocation, useNavigate } from "react-router";
import API_BASE_URL from "./config";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {}; // Get username from navigation state
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to hold the available item types for the filter dropdown
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest-oldest');
  
  // New state to manage whether to show all products or just the recent ones
  const [isShowingAll, setIsShowingAll] = useState(false);

  // Hardcoded item types as requested
  const itemTypes = ['Electronics', 'Books', 'Apparel', 'Home Goods', 'Others'];

  useEffect(() => {
    if (!username) {
        setError("Username not found. Please log in.");
        setIsLoading(false);
        return;
    }
    
    // Function to fetch recent products based on username
    const fetchRecentProducts = async () => {
      try {
        const url = `${API_BASE_URL}/api/products/recent/${username}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        setError(e.message);
        setIsLoading(false);
      }
    };
    
    // Only fetch and poll if we are not in "Show All" mode
    if (!isShowingAll) {
      fetchRecentProducts();

      // Set up a polling mechanism to refresh the data periodically
      const intervalId = setInterval(fetchRecentProducts, 5000);

      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    }
  }, [username, isShowingAll]); 

  // Function to fetch and display ALL products from the backend
  const handleShowAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/products/all/${username}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch all products');
      }
      const data = await response.json();
      setProducts(data);
      setSelectedFilter('All'); // Reset the filter to 'All'
      setIsShowingAll(true); // Set state to show all products
    } catch (e) {
      console.error("Error fetching all documents: ", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter and sort the products
  const getFilteredAndSortedProducts = () => {
    // 1. Filter the products
    const filtered = products.filter(product => {
      if (selectedFilter === 'All') {
        return true;
      }
      return product.itemType === selectedFilter;
    });

    // 2. Sort the filtered products
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      if (sortOrder === 'latest-oldest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return sorted;
  };

  const handleNavigateToForm = () => {
    navigate('/ProductForm', { state: { username }});
  };

  const filteredAndSortedProducts = getFilteredAndSortedProducts();

  if (isLoading) {
    return (
        <div className="container">
          <div className="product-list-card"><p className="no-items">Loading recent items...</p></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container">
          <div className="product-list-card"><p className="no-items" style={{ color: 'red' }}>Error: {error}</p></div>
        </div>
    );
  }

  return (
    <div className="container">
        <div className="product-list-card">
            <h2 className="list-title">Recently Added Items</h2>
            {/* New "Show All" button position */}
            <button onClick={handleShowAll} className="show-all-button">
                Show All
            </button>
            <div className="controls-container">
                {/* Sort filter on the left */}
                <div className="sort-container">
                    <label htmlFor="sortFilter">Sort by:</label>
                    <select 
                        id="sortFilter" 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="latest-oldest">Latest-Oldest</option>
                        <option value="oldest-latest">Oldest-Latest</option>
                    </select>
                </div>

                {/* Item type filter on the right */}
                <div className="filter-container">
                    <label htmlFor="itemFilter">Filter by:</label>
                    <select 
                        id="itemFilter" 
                        value={selectedFilter} 
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All</option>
                        {itemTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
            <ul className="product-list">
                {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map((product) => (
                    <li key={product._id} className="product-item">
                        <div className="product-info">
                            <span className="product-name">{product.productName}</span>
                            <span className="product-details">
                            Type: {product.itemType}
                            </span>
                            <span className="product-details">
                            Added: {new Date(product.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <span className="product-quantity">{product.quantity}</span>
                    </li>
                    ))
                ) : (
                    <p className="no-items">No items found for this filter.</p>
                )}
            </ul>
        </div>
        
        <button className="add-product-button" onClick={handleNavigateToForm}>
            +
        </button>
    </div>
  );
};

export default ProductList;
