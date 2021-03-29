/**
 * Creates Frame with react components content inside .mdx docs
 * usage: usage.mdx
 */

import styled from 'styled-components';

export const Frame = styled.div`
  resize: both;
  width: 100%;
  border: 2px solid var(--base, rgb(246, 248, 250));
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 4px;

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  & + .prism-code {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;
