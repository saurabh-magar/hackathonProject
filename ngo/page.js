"use client";

import { useState } from "react";

function LocatePage() {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState({});

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
    { distance: "2 km" },
    { distance: "8 km" },
  ];

  // Buttons with IDs
  const buttons = [
    { id: "donors", text: "Locate Donors", color: "bg-blue-500 hover:bg-blue-600" },
    { id: "volunteers", text: "Locate Volunteers", color: "bg-green-500 hover:bg-green-600" },
    { id: "biogas", text: "Locate Biogas Plants", color: "bg-yellow-500 hover:bg-yellow-600" },
  ];

  // Function to get data based on selected button
  const getData = () => {
    if (selected === "donors") return donors;
    if (selected === "volunteers") return volunteers;
    if (selected === "biogas") return biogasPlants;
    return [];
  };

  // Handle action (Accept/ Appoint)
  const handleAction = (index) => {
    setStatus((prev) => ({
      ...prev,
      [`${selected}-${index}`]: true, // Mark as "accepted/appointed"
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Find Nearby Resources</h1>

      {/* Buttons Section (Initial State) */}
      {!selected && (
        <div className="flex justify-center gap-6 mb-8">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-md ${button.color}`}
              onClick={() => setSelected(button.id)}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Section */}
      {selected && (
        <div className="flex w-full">
          {/* Content Area (80%) */}
          <div className="w-4/5 bg-white p-6 rounded-lg shadow-lg">
            {/* Back Button */}
            <button
              className={`px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md w-full mb-4 ${buttons.find(b => b.id === selected)?.color}`}
              onClick={() => setSelected(null)}
            >
              {buttons.find(b => b.id === selected)?.text}
            </button>

            {/* Data Display Section */}
            <div className="space-y-4">
              {getData().map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md flex justify-between items-center">
                  <div>
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
                      <p className="text-lg font-semibold text-gray-800">🏭 Biogas Plant - Distance: {item.distance}</p>
                    )}
                  </div>

                  {/* Action Button (Disable when clicked) */}
                  {selected !== "biogas" && (
                    <button
                      className={`px-4 py-2 rounded-lg shadow-md ${status[`${selected}-${index}`] ? "bg-gray-400 cursor-not-allowed" : selected === "donors" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                      onClick={() => handleAction(index)}
                      disabled={status[`${selected}-${index}`]}
                    >
                      {status[`${selected}-${index}`] ? (selected === "donors" ? "Accepted" : "Appointed") : selected === "donors" ? "Accept Food" : "Contact / Appoint"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Buttons (20%) */}
          <div className="w-1/5 flex flex-col items-end gap-4 p-6">
            {buttons
              .filter((button) => button.id !== selected)
              .map((button) => (
                <button
                  key={button.id}
                  className={`px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md w-full ${button.color}`}
                  onClick={() => setSelected(button.id)}
                >
                  {button.text}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocatePage;
