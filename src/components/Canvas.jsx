import React, { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
function Canvas({ selectedTool, elements, setSelectedTool }) {
  const [rerender, setRerender] = useState(false);
  const [draggingElement, setDraggingElement] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {}, [rerender]);

  const drawScene = () => {
    setRerender(!rerender);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);
    ctx.clearRect(
      -0.5,
      -0.5,
      canvasRef.current.width,
      canvasRef.current.height
    );

    elements.forEach((element) => {
      element.draw(rc, ctx);
    });
  };

  const generateElement = (element) => {
    const generator = rough.generator();
    if (element.type === 'selection') {
      element.draw = (rc, ctx) => {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
      };
    } else if (element.type === 'rectangle') {
      const shape = generator.rectangle(0, 0, element.width, element.height);
      element.draw = (rc, ctx) => {
        ctx.translate(element.x, element.y);
        rc.draw(shape);
        ctx.translate(-element.x, -element.y);
      };
    } else if (element.type === 'diamond') {
    } else if (element.type === 'circle') {
    } else if (element.type === 'arrow') {
    } else if (element.type === 'line') {
    } else if (element.type === 'pen') {
    } else if (element.type === 'text') {
    } else if (element.type === 'erase') {
    } else {
    }
  };

  const newElement = (type, x, y, width = 100, height = 100) => {
    const element = {
      type,
      x,
      y,
      width,
      height,
    };
    return element;
  };

  return (
    <>
      <canvas
        id='canvas'
        width={document.documentElement.clientWidth - 30}
        height={1000}
        style={{ border: '1px solid red' }}
        ref={canvasRef}
        onMouseDown={(e) => {
          const x = e.clientX - e.target.offsetLeft;
          const y = e.clientY - e.target.offsetTop;
          const element = newElement(selectedTool, x, y);

          generateElement(element);
          elements.push(element);
          setDraggingElement(element);
        }}
        onMouseMove={(e) => {
          // change size of element (current) by dragging
          const element = draggingElement;
          if (!element) return;
          // current mouse position relative to the canvas minus the position (x,y) of dragging element
          const width = e.clientX - e.target.offsetLeft - draggingElement.x;
          const height = e.clientY - e.target.offsetTop - draggingElement.y;
          element.width = width;
          element.height = height;
          generateElement(element);
          drawScene();
        }}
        onMouseUp={(e) => {
          if (draggingElement.type === 'selection') {
            elements.pop();
            setSelectedTool('selection');
            drawScene();
          }

          setDraggingElement(null);
        }}
      ></canvas>
    </>
  );
}

export default Canvas;
