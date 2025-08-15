import React, { useState } from 'react';
import './ProductForm.css'; // Import the CSS file
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function
  const { username } = location.state || {}; // Get username from navigation state

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemType, setItemType] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!productName || !quantity || !itemType) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    // New validation: Check if quantity is a number greater than 0
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setMessage({ type: 'error', text: 'Quantity must be a number greater than 0.' });
      return;
    }

    // Set loading state and clear previous messages
    setIsLoading(true);
    setMessage(null);

    // Create the data object to send to the backend
    const productData = {
      username,
      productName,
      quantity: Number(quantity),
      itemType,
      isPublic
    };

    try {
      // Send the data to the backend endpoint
      const response = await fetch(`${API_BASE_URL}/api/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      // Check if the response was successful
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: data.message || 'Product added successfully!' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to add product.' });
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
      setMessage({ type: 'error', text: 'Could not connect to the server. Please try again.' });
    } finally {
      // Reset loading state after the request is complete
      setIsLoading(false);
    }
  };

  const handleNavigateToList = () => {
    navigate('/ProductList', { state: { username } });
  };

  const handleNavigateToUpdate = () => {
    navigate('/UpdateForm', { state: { username } });
  };

  return (
    <div className="container">
      <div className="product-form-card">
        <h2 className="form-title">Add New Product</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="form-input"
              placeholder="e.g., Laptop, T-shirt"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="form-input"
              placeholder="e.g., 50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="itemType" className="form-label">Item Type</label>
            <select
              id="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              required
              className="form-select"
            >
              <option value="" disabled>Select an item type</option>
              <option value="Electronics">Electronics</option>
              <option value="Apparel">Apparel</option>
              <option value="Books">Books</option>
              <option value="Home Goods">Home Goods</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <span className="form-label">Display Publicly?</span>
            <div className="button-group">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`yes-button ${isPublic ? 'active' : ''}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`no-button ${!isPublic ? 'active' : ''}`}
              >
                No
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        {/* New button to navigate to the list */}
        <button
            type="button"
            onClick={handleNavigateToList}
            className="list-items-button"
        >
            List Items
        </button>
        <button
            type="button"
            onClick={handleNavigateToUpdate}
            className="list-items-button"
        >
            update items
        </button>
        {message && (
          <div
            className={`message-display ${
              message.type === 'success' ? 'message-success' : 'message-error'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
