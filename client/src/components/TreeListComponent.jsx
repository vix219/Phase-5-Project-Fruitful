import React, { useState } from "react";
import "./TreeList.css"

const TreeListComponent = ({ trees, setListOfTrees }) => {
  const [editingTreeId, setEditingTreeId] = useState(null);
  const [editedTree, setEditedTree] = useState({ address: "", notes: "" });

  const deleteTree = async (treeId) => {
    try {
      const response = await fetch(`/trees/${treeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
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

  const handleEditClick = (tree) => {
    setEditingTreeId(tree.id);
    setEditedTree({ address: tree.address || "", notes: tree.notes || "" });
  };

  const handleSaveClick = async (treeId) => {
    try {
      const response = await fetch(`/trees/${treeId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTree),
      });

      if (response.ok) {
        setListOfTrees((prevTrees) =>
          prevTrees.map((tree) =>
            tree.id === treeId ? { ...tree, ...editedTree } : tree
          )
        );
        setEditingTreeId(null);
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
      {trees.length === 0 ? (
        <p>No trees added yet.</p>
      ) : (
        <ul>
          {trees.map((tree, idx) => (
            <li key={idx} style={{ marginBottom: "15px" }}>
              <strong>{tree.fruit_type ? tree.fruit_type.fruit_name : "Unknown Fruit"}</strong><br />
              {editingTreeId === tree.id ? (
                <>
                  <label>
                    Address:
                    <input
                      type="text"
                      value={editedTree.address}
                      onChange={(e) => setEditedTree({ ...editedTree, address: e.target.value })}
                    />
                  </label><br />
                  <label>
                    Notes:
                    <input
                      type="text"
                      value={editedTree.notes}
                      onChange={(e) => setEditedTree({ ...editedTree, notes: e.target.value })}
                    />
                  </label><br />
                  <button onClick={() => handleSaveClick(tree.id)} style={{ marginTop: "5px" }}>
                    Save
                  </button>
                  <button onClick={() => setEditingTreeId(null)} style={{ marginLeft: "5px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <em>Address:</em> {tree.address || "Address not available"}<br />
                  <em>Notes:</em> {tree.notes || "No notes"}<br />
                  <button onClick={() => handleEditClick(tree)} style={{ marginTop: "5px", marginRight: "5px" }}>
                    Edit
                  </button>
                </>
              )}
              <button onClick={() => deleteTree(tree.id)} style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}>
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
