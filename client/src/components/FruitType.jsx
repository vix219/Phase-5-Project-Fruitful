import React, { useEffect, useState } from 'react';

function FruitType() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleText = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchFruits = () => {
    fetch("fruit-type")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then((data) => {
        setFruits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching in FruitType:", error);
        setError("Failed to load fruit data.");
        setLoading(false);
      });
  };

  const handleDeleteFruit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fruit type?")) return;
  
    try {
      const response = await fetch(`http://localhost:5555/fruit-type/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setFruits(fruits.filter(fruit => fruit.id !== id));
      } else {
        const err = await response.json();
        alert("Failed to delete fruit: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting fruit type:", err);
    }
  };
  

  useEffect(fetchFruits, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="fruit-container">
      {fruits.map((fruit) => {
        const isExpanded = expandedCards[fruit.id];
        return (
          <div className="fruit-card" key={fruit.id}>
            <h2 className="h4">{fruit.fruit_name}</h2>
            <img
              className="img"
              src={fruit.image_url}
              alt={fruit.fruit_name}
              style={{ maxWidth: '300px' }}
            />
            <p className="p1"><strong>Season:</strong> {fruit.season}</p>
            <div className={`text-wrapper ${isExpanded ? 'expanded' : ''}`}  >
          
                <p className="p2">
            {isExpanded ? fruit.info : `${fruit.info.substring(0, 100)}...`}
                </p>

              </div>
              <button onClick={() => toggleText(fruit.id)} className="read-more-btn">
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>

              <button onClick={() => handleDeleteFruit(fruit.id)} className="delete-btn" style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                Delete
              </button>

          </div>
        );
      })}
    </div>
  );
}

export default FruitType;