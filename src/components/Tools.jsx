import React from 'react';
import './Tools.css';
function Tools({ selectedTool, setSelectedTool }) {
  const toolTypes = [
    'selection',
    'rectangle',
    'circle',
    'arrow',
    'line',
    'pen',
    'text',
    'erase',
  ];

  return (
    <div>
      {toolTypes.map((tool, idx) => {
        return (
          <button
            key={idx}
            className={selectedTool === tool ? 'active' : ''}
            onClick={() => setSelectedTool(tool)}
          >
            {tool.substring(0, 1).toUpperCase() + tool.substring(1)}
          </button>
        );
      })}
    </div>
  );
}

export default Tools;
