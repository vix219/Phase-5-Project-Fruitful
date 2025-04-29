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
            <li key={idx}>
              <strong>{tree.treeType}</strong> at {tree.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeListComponent;
