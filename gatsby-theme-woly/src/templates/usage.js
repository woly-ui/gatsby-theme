import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Layout } from '../components/layout';
import { pageSections } from '../lib/constants';
import { Tabs } from '../components/tabs';

const installation = ({ package: p }) =>
  `npm install ${p}
# or
yarn add ${p}`;

const getTabData = ({ nodes, mapper, meta }) => {
  return mapper.reduce((all, { code, label, renderHeader }) => {
    const page = nodes.find((node) => node.type === code);

    if (page) {
      all.push({
        label,
        content: <MDXRenderer>{page.body}</MDXRenderer>,
        header: renderHeader ? renderHeader(meta) : null,
      });
    }

    return all;
  }, []);
};

const ComponentPage = ({ pageContext }) => {
  const { nodes, ...meta } = pageContext;

  const tabData = getTabData({ nodes, mapper: pageSections, meta });

  return (
    <Layout>
      <div>
        <h2>{meta.name}</h2>

        {/* <h3>Installation</h3> */}
        {/* prettier-ignore */}
        {/* <pre>
          {installation(frontmatter)}
        </pre> */}
        <Tabs data={tabData} />
      </div>
    </Layout>
  );
};

// export const pageQuery = graphql`
//   query($pageID: String!) {
//     usage: mdx(id: { eq: $pageID }) {
//       frontmatter {
//         name
//         package
//         category
//       }
//       body
//     }
//   }
// `;

export default ComponentPage;
