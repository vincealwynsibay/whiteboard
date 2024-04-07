import { useRef, useState } from 'react';
import Tools from './components/Tools';
import Canvas from './components/Canvas';

const elements = [];
function App() {
  const [selectedTool, setSelectedTool] = useState('selection');

  return (
    <>
      <Tools selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <Canvas
        elements={elements}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
    </>
  );
}

export default App;
