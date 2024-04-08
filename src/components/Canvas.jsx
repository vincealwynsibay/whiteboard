import React, { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

let isDraggingElements = false;
let lastX = 0;
let lastY = 0;
function Canvas({ selectedTool, elements, setSelectedTool }) {
  const [rerender, setRerender] = useState(false);
  const [draggingElement, setDraggingElement] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
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

      if (element.isSelected) {
        // setup border
        const x1 = element.x;
        const x2 = element.x + element.width;
        const y1 = element.y;
        const y2 = element.y + element.height;
        const lineDash = ctx.getLineDash();
        ctx.setLineDash([2, 4]);
        const margin = 2;
        ctx.strokeRect(
          x1 - margin,
          y1 - margin,
          x2 - x1 + margin * 2,
          y2 - y1 + margin * 2
        );

        ctx.setLineDash(lineDash);
      }
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
      const shape = generator.ellipse(
        element.width / 2,
        element.height / 2,
        element.width,
        element.height
      );
      element.draw = (rc, ctx) => {
        ctx.translate(element.x, element.y);
        rc.draw(shape);
        ctx.translate(-element.x, -element.y);
      };
    } else if (element.type === 'arrow') {
    } else if (element.type === 'line') {
    } else if (element.type === 'pen') {
    } else if (element.type === 'text') {
    } else if (element.type === 'erase') {
    } else {
    }
  };

  const newElement = (type, x, y, width = 0, height = 0) => {
    const element = {
      type,
      x,
      y,
      width,
      height,
      isSelected: false,
    };
    return element;
  };

  // check if position (x,y) is inside an element's position
  const isInsideElement = (element, x, y) => {
    const x1 = element.x;
    const x2 = element.x + element.width;
    const y1 = element.y;
    const y2 = element.y + element.height;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  };

  const setElementsToSelected = (selected) => {
    console.log(selected);
    const selectedX = selected.x;
    const selectedY = selected.y;

    elements = elements.map((element) => {
      // check if element is inside selection
      if (isInsideElement(selected, element.x, element.y)) {
        return { ...element, isSelected: true };
      } else {
        return element;
      }
    });
  };

  // check if element is inside selection then set element.isSelected as true
  const setSelection = (selection) => {
    const selectionX1 = selection.x;
    const selectionX2 = selection.x + selection.width;
    const selectionY1 = selection.y;
    const selectionY2 = selection.y + selection.height;
    elements.forEach((element) => {
      const elementX1 = element.x;
      const elementX2 = element.x + element.width;
      const elementY1 = element.y;
      const elementY2 = element.y + element.height;

      element.isSelected =
        element.type !== 'selection' &&
        selectionX1 <= elementX1 &&
        selectionX2 >= elementX2 &&
        selectionY1 <= elementY1 &&
        selectionY2 >= elementY2;
    });
  };

  const clearAllSelection = () => {
    elements = elements.map((element) => ({ ...element, isSelected: false }));
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

          if (element.type === 'selection') {
            // check if an element is inside selection
            const selected = elements.find((ele) => isInsideElement(ele, x, y));
            setSelectedElement(selected);
            // set element for selected for changing isSelected to true when mouse up
            if (selected) {
              //   setSelectedElement(selected);
              setDraggingElement(selected);
            }

            isDraggingElements = elements.some((ele) => ele.isSelected);
          }

          generateElement(element);
          elements.push(element);
          // set element for changing size by dragging
          setDraggingElement(element);
          lastX = x;
          lastY = y;
        }}
        onMouseMove={(e) => {
          if (isDraggingElements) {
            // move all elements with is selected
            const selectedElements = elements.filter((ele) => ele.isSelected);
            if (selectedElements.length > 0) {
              const x = e.clientX - e.target.offsetLeft;
              const y = e.clientY - e.target.offsetTop;
              selectedElements.map((ele) => {
                ele.x += x - lastX;
                ele.y += y - lastY;
              });

              lastX = x;
              lastY = y;
              drawScene();
              return;
            }
          }

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
          // dragging element is null when i click, idk why
          console.log(selectedElement);

          if (draggingElement === null) {
            clearAllSelection();
            console.log(elements);
            drawScene();
          }

          if (draggingElement.type === 'selection') {
            const element = { ...draggingElement };

            if (isDraggingElements) {
              isDraggingElements = false;
            }

            elements.pop();
            setSelection(element);
          } else {
            draggingElement.isSelected = true;
          }

          setDraggingElement(null);
          setSelectedElement(null);
          setSelectedTool('selection');
          drawScene();
        }}
      ></canvas>
    </>
  );
}

export default Canvas;
