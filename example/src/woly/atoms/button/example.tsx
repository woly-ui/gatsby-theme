import React from 'react';
import styled from 'styled-components';

const Icon = () => (
  <svg
    width="8"
    height="15"
    viewBox="0 0 8 15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill-rule="nonzero" transform="translate(8) rotate(90)">
      <circle cx="1.5" cy="1.5" r="1.5"></circle>
      <circle cx="1.5" cy="6.5" r="1.5"></circle>
      <circle cx="7.5" cy="1.5" r="1.5"></circle>
      <circle cx="7.5" cy="6.5" r="1.5"></circle>
      <circle cx="13.5" cy="1.5" r="1.5"></circle>
      <circle cx="13.5" cy="6.5" r="1.5"></circle>
    </g>
  </svg>
);

export const Example: React.FC = ({ children }) => {
  const parent = React.useRef(null);
  const [isMoving, setMoving] = React.useState(false);
  const [width, setWidth] = React.useState(100);
  const handleMouseMove = React.useCallback((event) => {}, []);

  return (
    <Container ref={parent}>
      <Resizable>{children}</Resizable>
      <Handler>
        <Icon />
      </Handler>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-flow: row;
  align-items: stretch;
  justify-content: stretch;
`;

const Handler = styled.div`
  background: #fff;
  border: 1px solid #e1e3e6;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0, 41, 77, 0.07);
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  border-left: 0;
  transition: border 0.3s ease;
  width: 36px;
  z-index: 3;
  box-sizing: border-box;

  svg {
    fill: #657787;
    left: 50%;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
`;

const Resizable = styled.div`
  display: block;
  padding: 8px;
  border: 1px solid #e1e3e6;
  flex-grow: 1;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
`;
