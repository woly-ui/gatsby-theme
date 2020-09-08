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

  return (
    <Container>
      <ComponentsMenu menu={createMapping(data)} />
      <Main>{children}</Main>
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
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
`;
