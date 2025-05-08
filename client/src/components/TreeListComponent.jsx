// Import React and useState hook
import React, { useState } from "react";
import "./TreeList.css"; // Import custom CSS styles

// Main functional component that receives `trees` and `setListOfTrees` as props
const TreeListComponent = ({ trees, setListOfTrees }) => {
  // Track which tree is currently being edited (by ID)
  const [editingTreeId, setEditingTreeId] = useState(null);

  // Store the currently edited tree data (address and notes)
  const [editedTree, setEditedTree] = useState({ address: "", notes: "" });

  // Function to delete a tree by its ID
  const deleteTree = async (treeId) => {
    try {
      const response = await fetch(`/trees/${treeId}`, {
        method: "DELETE",
        credentials: "include", // Include cookies (for auth/session)
      });

      if (response.ok) {
        // Remove deleted tree from list
        setListOfTrees((prevTrees) =>
          prevTrees.filter((tree) => tree.id !== treeId)
        );
        alert("Tree deleted successfully.");
      } else {
        // Handle non-OK HTTP response
        const errorText = await response.text();
        console.error("Failed to delete tree:", errorText);
        alert("Failed to delete tree.");
      }
    } catch (err) {
      // Handle network or other unexpected errors
      console.error("Error deleting tree:", err);
      alert("Error deleting tree.");
    }
  };

  // Triggered when user clicks the "Edit" button
  const handleEditClick = (tree) => {
    setEditingTreeId(tree.id); // Mark this tree as being edited
    // Pre-fill form inputs with existing address and notes
    setEditedTree({
      address: tree.address || "",
      notes: tree.notes || "",
    });
  };

  // Triggered when user clicks the "Save" button for an edited tree
  const handleSaveClick = async (treeId) => {
    try {
      const response = await fetch(`/trees/${treeId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTree), // Send updated tree data
      });

      if (response.ok) {
        // Update local state with new data
        setListOfTrees((prevTrees) =>
          prevTrees.map((tree) =>
            tree.id === treeId ? { ...tree, ...editedTree } : tree
          )
        );
        setEditingTreeId(null); // Exit edit mode
        alert("Tree updated successfully.");
      } else {
        const errorText = await response.text();
        console.error("Failed to update tree:", errorText);
        alert("Failed to update tree.");
      }
    } catch (err) {
      console.error("Error updating tree:", err);
      alert("Error updating tree.");
    }
  };

  return (
    <div className="tree-list">
      <h3>Planted Trees</h3>

      {/* Display message if there are no trees in the list */}
      {trees.length === 0 ? (
        <p>No trees added yet.</p>
      ) : (
        <ul>
          {/* Render each tree in the list */}
          {trees.map((tree) => (
            <li key={tree.id} style={{ marginBottom: "15px" }}>
              {/* Show fruit name if available, else fallback to "Unknown Fruit" */}
              <strong>{tree.fruit_type ? tree.fruit_type.fruit_name : "Unknown Fruit"}</strong><br />

              {/* If this tree is being edited, show input fields */}
              {editingTreeId === tree.id ? (
                <>
                  <label>
                    Address:
                    <input
                      type="text"
                      value={editedTree.address}
                      onChange={(e) =>
                        setEditedTree({ ...editedTree, address: e.target.value })
                      }
                    />
                  </label><br />
                  <label>
                    Notes:
                    <input
                      type="text"
                      value={editedTree.notes}
                      onChange={(e) =>
                        setEditedTree({ ...editedTree, notes: e.target.value })
                      }
                    />
                  </label><br />
                  
                  {/* Save and Cancel buttons */}
                  <button onClick={() => handleSaveClick(tree.id)} style={{ marginTop: "5px" }}>
                    Save
                  </button>
                  <button onClick={() => setEditingTreeId(null)} style={{ marginLeft: "5px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                // If not editing, just show static info and Edit button
                <>
                  <em>Address:</em> {tree.address || "Address not available"}<br />
                  <em>Notes:</em> {tree.notes || "No notes"}<br />
                  <button
                    onClick={() => handleEditClick(tree)}
                    style={{ marginTop: "5px", marginRight: "5px" }}
                  >
                    Edit
                  </button>
                </>
              )}

              {/* Always show Delete button, regardless of edit mode */}
              <button
                onClick={() => deleteTree(tree.id)}
                style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}
              >
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
