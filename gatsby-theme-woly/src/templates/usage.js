import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Layout } from '../components/layout';
import { Tabs } from '../components/tabs';

import { pageSections } from '../lib/constants';

const getTabData = ({ pages, mapper }) => {
  return mapper.reduce((all, { code, label, renderHeader }) => {
    const page = pages.find((page) => page.type === code);

    if (page) {
      all.push({
        label,
        meta: page.meta,
        content: <MDXRenderer>{page.body}</MDXRenderer>,
        header: renderHeader,
      });
    }

    return all;
  }, []);
};

const ComponentPage = ({ pageContext }) => {
  const { pages } = pageContext;

  const tabData = getTabData({ pages, mapper: pageSections });

  return (
    <Layout>
      <div>
        <h2>{pageContext.name}</h2>
        <Tabs data={tabData} />
      </div>
    </Layout>
  );
};

export default ComponentPage;
