"use client";

import { useState } from "react";

function LocatePage() {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState({});
  const [pickupForm, setPickupForm] = useState(null); // Store selected biogas plant
  const [wasteDetails, setWasteDetails] = useState({ quantity: "", description: "" });

  // Sample data arrays
  const donors = [
    { name: "John Doe", location: "New York", foodQuantity: "10 kg", estimatedExpiry: "2025-02-20", foodType: "Veg" },
    { name: "Alice Smith", location: "Los Angeles", foodQuantity: "5 kg", estimatedExpiry: "2025-02-19", foodType: "Non-Veg" },
  ];

  const volunteers = [
    { name: "Bob Johnson", mobileNumber: "1234567890", distance: "5 km" },
    { name: "Emma Brown", mobileNumber: "9876543210", distance: "3 km" },
  ];

  const biogasPlants = [
    { id: 1, distance: "2 km" },
    { id: 2, distance: "8 km" },
  ];

  // Buttons with IDs
  const buttons = [
    { id: "donors", text: "Locate Donors", color: "bg-blue-500 hover:bg-blue-600" },
    { id: "volunteers", text: "Locate Volunteers", color: "bg-green-500 hover:bg-green-600" },
    { id: "biogas", text: "Locate Biogas Plants", color: "bg-yellow-500 hover:bg-yellow-600" },
  ];

  const getData = () => {
    if (selected === "donors") return donors;
    if (selected === "volunteers") return volunteers;
    if (selected === "biogas") return biogasPlants;
    return [];
  };

  const handleAction = (index) => {
    setStatus((prev) => ({
      ...prev,
      [`${selected}-${index}`]: true,
    }));
  };

  const handleBiogasClick = (index) => {
    setPickupForm(index);
    setWasteDetails({ quantity: "", description: "" });
  };

  const handlePickupRequest = () => {
    alert(`Pickup Requested!\nQuantity: ${wasteDetails.quantity}\nDescription: ${wasteDetails.description}`);
    setPickupForm(null); // Close the form after submission
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
        Find Nearby Resources
      </h1>

      {!selected && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`px-6 py-3 text-base sm:text-lg font-semibold text-white rounded-lg shadow-md ${button.color}`}
              onClick={() => setSelected(button.id)}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="flex flex-col sm:flex-row w-full gap-4">
          <div className="w-full sm:w-4/5 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-white rounded-lg shadow-md w-full mb-4 ${buttons.find(b => b.id === selected)?.color}`}
              onClick={() => setSelected(null)}
            >
              {buttons.find(b => b.id === selected)?.text}
            </button>

            <div className="space-y-4">
              {getData().map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center"
                >
                  <div className="text-center sm:text-left w-full">
                    {selected === "donors" && (
                      <>
                        <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-600">📍 {item.location}</p>
                        <p className="text-gray-600">🍱 {item.foodQuantity} - Expiry: {item.estimatedExpiry}</p>
                        <p className="text-gray-600">🥗 Type: {item.foodType}</p>
                      </>
                    )}
                    {selected === "volunteers" && (
                      <>
                        <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-600">📞 {item.mobileNumber}</p>
                        <p className="text-gray-600">📍 Distance: {item.distance}</p>
                      </>
                    )}
                    {selected === "biogas" && (
                      <>
                        <p className="text-lg font-semibold text-gray-800">
                          🏭 Biogas Plant - Distance: {item.distance}
                        </p>
                        <button
                          className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md"
                          onClick={() => handleBiogasClick(index)}
                        >
                          Request Pickup
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-1/5 flex flex-col items-end gap-4 p-2 sm:p-6">
            {buttons
              .filter((button) => button.id !== selected)
              .map((button) => (
                <button
                  key={button.id}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-white rounded-lg shadow-md w-full ${button.color}`}
                  onClick={() => setSelected(button.id)}
                >
                  {button.text}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Pickup Form */}
      {pickupForm !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Pickup</h2>
            <input
              type="text"
              placeholder="Enter quantity (kg)"
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 text-gray-900"
              value={wasteDetails.quantity}
              onChange={(e) => setWasteDetails({ ...wasteDetails, quantity: e.target.value })}
            />
            <textarea
              placeholder="Enter waste description"
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 text-gray-900"
              value={wasteDetails.description}
              onChange={(e) => setWasteDetails({ ...wasteDetails, description: e.target.value })}
            />

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setPickupForm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                onClick={handlePickupRequest}
              >
                Confirm Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocatePage;
