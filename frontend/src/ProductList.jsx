import React, { useState, useEffect } from 'react';
import './ProductList.css'; 
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {}; // Get username from navigation state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if a username is available
    if (!username) {
        setError("Username not found. Please log in.");
        setIsLoading(false);
        return;
    }
    
    const fetchRecentProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/recent/${username}`);
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
    
    // Initial fetch
    fetchRecentProducts();

    // Set up a polling mechanism to refresh the data periodically (e.g., every 5 seconds)
    const intervalId = setInterval(fetchRecentProducts, 5000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);

  }, [username]); // The effect now re-runs if the username changes

  const handleNavigateToForm = () => {
    navigate('/ProductForm', { state: { username }});
  };

  if (isLoading) {
    return <div className="product-list-card"><p className="no-items">Loading recent items...</p></div>;
  }

  if (error) {
    return <div className="product-list-card"><p className="no-items" style={{ color: 'red' }}>Error: {error}</p></div>;
  }

  return (
    <div className="product-list-card">
      <h2 className="list-title">Recently Added Items</h2>
      <ul className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} className="product-item">
              <div className="product-info">
                <span className="product-name">{product.productName}</span>
                <span className="product-details">
                  Type: {product.itemType} | Added: {new Date(product.timestamp).toLocaleString()}
                </span>
              </div>
              <span className="product-quantity">{product.quantity}</span>
            </li>
          ))
        ) : (
          <p className="no-items">No items added yet. Your recently added products will appear here.</p>
        )}
      </ul>
      
      {/* Plus button for navigation */}
      <button className="add-product-button" onClick={handleNavigateToForm}>
        +
      </button>

    </div>
  );
};

export default ProductList;
