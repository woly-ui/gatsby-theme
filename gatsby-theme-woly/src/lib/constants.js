import React from 'react';
import { pascalCase } from 'change-case';

export const pageSections = [
  {
    code: 'usage',
    label: 'Usage',
    renderHeader: (meta) => {
      return (
        <pre>
          import {'{'} {pascalCase(meta.name)} {'}'} from "{meta.package}
          ";
        </pre>
      );
    },
  },
  { code: 'specification', label: 'Specification' },
  { code: 'state', label: 'State Map' },
];
