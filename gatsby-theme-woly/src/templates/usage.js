import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

const installation = ({ package: p }) =>
  `npm install ${p}
# or
yarn add ${p}`;

const ComponentPage = ({ data, pageContext }) => {
  const { frontmatter } = data.usage;
  return (
    <div>
      <h2>{frontmatter.name}</h2>
      <h3>Use it</h3>
      <pre>
        import {'{'} {frontmatter.name} {'}'} from "{frontmatter.package}";
      </pre>
      <h3>Installation</h3>
      {/* prettier-ignore */}
      <pre>
        {installation(frontmatter)}
      </pre>
      <MDXRenderer>{data.usage.body}</MDXRenderer>
    </div>
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
