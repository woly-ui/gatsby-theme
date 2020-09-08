import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

export const ComponentsMenu = ({ menu }) => {
  return (
    <Block>
      <h3>Components</h3>
      {menu.map((group) => (
        <Group key={group.name} group={group} />
      ))}
    </Block>
  );
};

const Group = ({ group }) => (
  <div>
    <h4>{group.name}</h4>
    <ul>
      {group.components.map((com) => (
        <li key={com.id}>
          <Link to={com.path}>{com.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Block = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-right: 3rem;
`;
