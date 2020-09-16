import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { camelCase } from 'change-case';
import styled from 'styled-components';

import { ComponentsMenu } from './components-menu';
import { paths } from '../paths';

export const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      mdx: allMdx(
        sort: { fields: [frontmatter___category, frontmatter___name] }
      ) {
        components: nodes {
          id
          meta: frontmatter {
            category
            name
            package
          }
        }
      }
    }
  `);

  const [isMobileMenuVisibile, setVisibility] = React.useState(false);
  const onClick = React.useCallback(() => {
    setVisibility(!isMobileMenuVisibile);
  }, [isMobileMenuVisibile]);

  return (
    <Container>
      <ComponentsMenu
        menu={createMapping(data)}
        isVisible={isMobileMenuVisibile}
        buttonClicked={onClick}
      />
      <Main isVisible={!isMobileMenuVisibile}>{children}</Main>
    </Container>
  );
};

function createMapping(data) {
  const packages = {};
  for (const component of data.mdx.components) {
    if (!packages[component.meta.package]) {
      packages[component.meta.package] = [];
    }

    packages[component.meta.package].push({
      ...component.meta,
      path: paths.componentUsage(component.meta),
      id: component.id,
      title: camelCase(component.meta.name),
    });
  }

  return Object.keys(packages).reduce((list, name) => {
    list.push({ name, components: packages[name] });
    return list;
  }, []);
}

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-family: 'Roboto', sans-serif;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 40px 0 0 240px;
  box-sizing: border-box;
  width: 100%;
  @media screen and (max-width: 768px) {
    padding: 40px 0 0 15px;
    display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  }
`;
