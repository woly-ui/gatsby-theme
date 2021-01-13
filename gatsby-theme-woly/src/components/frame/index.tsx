/**
 * Creates iFrame with react components content inside .mdx docs
 * usage: usage.mdx
 */

import * as React from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

export const Frame = ({ children, title, ...props }) => {
  const [contentRef, setContentRef] = React.useState(null)
  const mountNode =
    contentRef?.contentWindow?.document?.body

  return (
    <StyledIframe title={title} {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </StyledIframe>
  )
}

const StyledIframe = styled.iframe`
  resize: both;
  width: 100%;
`;
