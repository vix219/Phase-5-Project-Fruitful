import React from "react";

const TreeListComponent = ({ trees, setListOfTrees }) => {
  const deleteTree = async (treeId) => {
    try {
      const response = await fetch(`/trees/${treeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // deleted the tree, update the list
        setListOfTrees((prevTrees) => prevTrees.filter((tree) => tree.id !== treeId));
        alert("Tree deleted successfully.");
      } else {
        const errorText = await response.text();
        console.error("Failed to delete tree:", errorText);
        alert("Failed to delete tree.");
      }
    } catch (err) {
      console.error("Error deleting tree:", err);
      alert("Error deleting tree.");
    }
  };

  return (
    <div className="tree-list">
      <h3>Planted Trees</h3>
      {trees.length === 0 ? (
        <p>No trees added yet.</p>
      ) : (
        <ul>
          {trees.map((tree, idx) => (
            <li key={idx} style={{ marginBottom: "10px" }}>
              <strong>{tree.fruit_type ? tree.fruit_type.fruit_name : "Unknown Fruit"}</strong><br />
              <em>Address:</em> {tree.address || "Address not available"}<br />
              <em>Notes:</em> {tree.notes || "No notes"}<br />
              <button onClick={() => deleteTree(tree.id)} style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeListComponent;
