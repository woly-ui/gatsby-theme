import React from 'react';
import styled from 'styled-components';
/**
 * TODO: set active tab from url
 */

export const Tabs = ({ data }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (data.length === 0) {
    console.warn('pass at least one tab data element');
    return null;
  }

  if (data.length === 1) {
    const [{ header, content, meta }] = data;

    return (
      <>
        {header?.(meta)}
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
    const tabContent = data[activeIndex];

    if (tabContent) {
      const { meta, content, header } = tabContent;

      return (
        <TabContent>
          {header?.(meta)}
          {content}
        </TabContent>
      );
    }

    return null;
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
  padding: 9px 15px;
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
  padding-top: 12px;

  &[data-active='false'] {
    display: none;
  }
`;
