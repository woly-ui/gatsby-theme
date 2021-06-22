import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { pascalCase } from 'change-case';
import { Layout } from '../components/layout';

const installation = ({ package: p }) =>
  `npm install ${p}
# or
yarn add ${p}`;

const ComponentPage = ({ data, pageContext }) => {
  const { body } = data.usage;
  const { name, category, package: packageName } = pageContext;

  return (
    <Layout>
      <div>
        <h2>{name}</h2>
        <pre>
          import {'{'} {pascalCase(name)} {'}'} from "{packageName}";
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
      fileAbsolutePath
      body
    }
  }
`;

export default ComponentPage;
