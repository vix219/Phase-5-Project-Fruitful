import React from "react";

const TreeListComponent = ({ trees }) => {
  return (
    <div className="tree-list">
      <h3>Planted Trees</h3>
      {trees.length === 0 ? (
        <p>No trees added yet.</p>
      ) : (
        <ul>
          {trees.map((tree, idx) => (
            <li key={idx} style={{ marginBottom: "10px" }}>
              <strong>{tree.fruit_name || "Unknown Fruit"}</strong><br />
              <em>Address:</em> {tree.address || "Address not available"}<br />
              <em>Notes:</em> {tree.notes || "No notes"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeListComponent;
