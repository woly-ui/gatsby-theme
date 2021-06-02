import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { pascalCase } from 'change-case';
import { Layout } from '../components/layout';
import { mapComponentName } from '../lib/constants';

const installation = ({ package: p }) =>
  `npm install ${p}
# or
yarn add ${p}`;

const ComponentPage = ({ data, pageContext }) => {
  const { frontmatter, body } = data.usage;
  if (frontmatter.category === mapComponentName) {
    return <MDXRenderer>{body}</MDXRenderer>;
  }
  return (
    <Layout>
      <div>
        <h2>{frontmatter.name}</h2>
        <pre>
          import {'{'} {pascalCase(frontmatter.name)} {'}'} from "
          {frontmatter.package}";
        </pre>
        {/* <h3>Installation</h3> */}
        {/* prettier-ignore */}
        {/* <pre>
          {installation(frontmatter)}
        </pre> */}
        <MDXRenderer>{body}</MDXRenderer>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query($pageID: String!) {
    usage: mdx(id: { eq: $pageID }) {
      frontmatter {
        name
        package
        category
      }
      body
    }
  }
`;

export default ComponentPage;
