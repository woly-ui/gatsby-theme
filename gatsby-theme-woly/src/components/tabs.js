import React from 'react';
import styled from 'styled-components';

export const Tabs = ({ data }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (data.length === 0) {
    console.warn('pass at least one tab data element');
  }

  if (data.length === 1) {
    const [{ header, content }] = data;

    return (
      <>
        {header}
        {content}
      </>
    );
  }

  const renderTabLabels = () => {
    return (
      <TabLabels>
        {data.map(({ label }, index) => (
          <TabLabel
            key={label}
            data-active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {label}
          </TabLabel>
        ))}
      </TabLabels>
    );
  };

  const renderTabContent = () => {
    return data.map(({ label, content, header }, index) => (
      <TabContent key={label} data-active={index === activeIndex}>
        {header}
        {content}
      </TabContent>
    ));
  };

  return (
    <>
      {renderTabLabels()}
      {renderTabContent()}
    </>
  );
};

const TabLabels = styled.div`
  display: flex;

  & > * + * {
    margin-left: 1rem;
  }
`;

const TabLabel = styled.button`
  padding: 0.8rem 1rem;
  font-size: inherit;
  font-family: inherit;
  background: none;
  border: none;
  border-bottom: var(--highlight-border);

  &[data-active='true'] {
    border-bottom-color: var(--accent);
  }
`;

const TabContent = styled.div`
  &[data-active='false'] {
    display: none;
  }
`;
