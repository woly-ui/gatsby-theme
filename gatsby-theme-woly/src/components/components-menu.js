import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { globalHistory as history } from '@reach/router';

const BurgerButton = ({ buttonClicked }) => (
  <Burger onClick={buttonClicked}>
    <input type="checkbox" />
    <span />
    <span />
    <span />
  </Burger>
);

export const ComponentsMenu = ({ menu, isVisible, buttonClicked }) => {
  const { location } = history;
  const link = location.pathname.split('/').filter((item) => item);
  const activeMenu = link.pop();

  return (
    <>
      <BurgerButton buttonClicked={buttonClicked} />
      <Block isVisible={isVisible}>
        {menu.map((group) => (
          <Group key={group.name} group={group} activeMenu={activeMenu} />
        ))}
      </Block>
    </>
  );
};

const Group = ({ group, activeMenu }) => (
  <div>
    <MenuHeader>{group.name}</MenuHeader>
    <MenuItems>
      {Object.keys(group.components).map((key) => (
        <GroupItems
          name={key}
          groupItems={group.components[key]}
          activeMenu={activeMenu}
        />
      ))}
    </MenuItems>
  </div>
);

export const GroupItems = ({ name, groupItems, activeMenu }) => (
  <>
    <CategoryHead>{name}</CategoryHead>
    {groupItems.map((com) => (
      <MenuItem key={com.id} active={com.name === activeMenu}>
        <Link to={com.path}>{com.name}</Link>
      </MenuItem>
    ))}
  </>
);

export const Burger = styled.div`
  display: block;
  position: fixed;
  top: 20px;
  left: 25px;
  height: 30px;
  z-index: 2;
  outline: none;
  display: none;
  user-select: none;

  input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    top: -7px;
    left: -5px;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
    -webkit-touch-callout: none;
  }

  span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    background: var(--highlight-color);
    border-radius: 3px;
    z-index: 1;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
  }

  input:checked ~ span:nth-child(2) {
    transform: rotate(45deg) translate(-2px, -2px);
    opacity: 1;
  }

  input:checked ~ span:nth-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }
  input:checked ~ span:nth-child(4) {
    transform: rotate(-45deg) translate(0, -4px);
    opacity: 1;
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const Menu = styled.div`
  @media screen and (max-width: 768px) {
    display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  }
`;

const Block = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 1;
  height: 100%;
  max-height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  position: fixed;
  background: #fff;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 50px 15px;
    top: 0;
    left: 0;
    display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
    position: inherit;
  }
`;

export const MenuHeader = styled.h3`
  text-transform: capitalize;
  font-weight: 300;
  border-bottom: 1px solid var(--base);
  padding: 0 0 10px 0;
  margin-bottom: 0px;
  margin-top: 20px;
`;

export const CategoryHead = styled.h4`
  padding: 0.5rem 5rem 0.5rem 0.5rem;
  margin-bottom: 0px;
`;

export const MenuItems = styled.ul`
  padding: 0;
`;

export const MenuItem = styled.li`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  a {
    text-decoration: none;
    color: var(--highlight-color);
    display: inline-block;
    padding: 0.5rem 5rem 0.5rem 0.5rem;
    background-color: transparent;
    font-weight: 300;
    background-color: ${(props) =>
      props.active ? 'var(--accent)' : 'transparent'};
    color: ${({ active }) =>
      active ? 'var(--main)' : 'var(--highlight-color);'};
    &:hover {
      background-color: ${(props) =>
        props.active ? 'var(--accent)' : 'var(--secondary)'};
      color: var(--highlight-color);
      color: ${({ active }) =>
        active ? 'var(--main)' : 'var(--highlight-color);'};

      transition: 0.25s;
    }
  }
`;
