import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './UpdateForm.css'; // Import the CSS file
import API_BASE_URL from "./config";

const UpdateForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || {}; // Get username from navigation state

    const [productName, setProductName] = useState('');
    const [quantityToUpdate, setQuantityToUpdate] = useState('');
    const [itemType, setItemType] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Hardcoded item types as requested
    const itemTypes = ['Electronics', 'Books', 'Apparel', 'Home Goods', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!productName || !quantityToUpdate || !itemType) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        // New validation: Check if quantity to update is a number greater than 0
        if (isNaN(Number(quantityToUpdate)) || Number(quantityToUpdate) === 0) {
            setMessage({ type: 'error', text: 'Quantity to update must be a non-zero number.' });
            return;
        }

        // Set loading state and clear previous messages
        setIsLoading(true);
        setMessage(null);

        // Create the data object to send to the backend
        const updateData = {
            username,
            productName,
            quantity: Number(quantityToUpdate), // Use a new key for the update quantity
            itemType,
        };

        try {
            // Send the data to the backend endpoint
            const response = await fetch(`${API_BASE_URL}/api/update-product`, {
                method: 'PUT', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            // Check if the response was successful
            if (response.ok) {
                const data = await response.json();
                setMessage({ type: 'success', text: data.message || 'Product updated successfully!' });
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.message || 'Failed to update product.' });
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

    return (
        <div className="container">
            <div className="update-form-card">
                <h2 className="form-title">Update Product Quantity</h2>
                
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
                        <label htmlFor="quantityToUpdate" className="form-label">Update Quantity</label>
                        <input
                            type="number"
                            id="quantityToUpdate"
                            value={quantityToUpdate}
                            onChange={(e) => setQuantityToUpdate(e.target.value)}
                            required
                            className="form-input"
                            placeholder="e.g., 10 (use negative to reduce)"
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
                            {itemTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        className="update-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                </form>

                {message && (
                    <div
                        className={`message-display ${
                            message.type === 'success' ? 'message-success' : 'message-error'
                        }`}
                    >
                        {message.text}
                    </div>
                )}
            <button className="list-items-button" onClick={handleNavigateToList}>
              List Items
            </button>
            </div>
            
        </div>
    );
};

export default UpdateForm;
