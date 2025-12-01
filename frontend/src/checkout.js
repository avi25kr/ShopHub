import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrdersView = ({ cart, setCart, orders, setOrders, saveOrders , setCurrentView, saveCart }) => {
  const [address, setAddress] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter a shipping address!");
      return;
    }

    // Append current order to previous orders
    const newOrders = [...orders, ...cart];

    await saveOrders(newOrders); // saveOrders will update state, localStorage, backend
    // setCart([]); // clear current cart
    saveCart([]); // also clear cart in localStorage
    localStorage.removeItem("cart");

    setShowConfirmation(true); // show confirmation popup
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white rounded-xl shadow-md w-full max-w-3xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>

        {/* Shipping Address */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Enter your shipping address..."
          />
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty</p>
          ) : (
            cart.map(item => (
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
                  <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Place Order */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <span className="text-xl font-semibold text-gray-900">
            Total: ${cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0).toFixed(2)}
          </span>
          <button
            onClick={handlePlaceOrder}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Place Order
          </button>
        </div>

        {/* Confirmation popup */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
              <h3 className="text-xl font-semibold text-green-600">✅ Order Placed!</h3>
              <p className="text-gray-700">Thank you for your purchase. Your order will be shipped to:</p>
              <p className="text-gray-900 font-medium">{address}</p>
              <button
                onClick={() => {setShowConfirmation(false); setAddress(""); setCurrentView('products'); navigate("/homepage");}}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;
