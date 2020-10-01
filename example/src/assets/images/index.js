import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

/**    To add new image inside query:
/*
/*    imageName: file(relativePath: { regex: "PATH_TO_IMAGE" }) {
/*      childImageSharp {
/*        resize(width: 180, height: 180, cropFocus: CENTER) {
/*           src
/*        }
/*       }
/*     }
*/

export const Image = ({ image }) => {
  const data = useStaticQuery(graphql`
    query {
      allImageSharp {
        edges {
          node {
            ... on ImageSharp {
              resize(width: 125, height: 125, rotate: 180) {
                src
              }
            }
          }
        }
      }
    }
  `);

  const imageSrc = data[image]?.childImageSharp?.resize?.src;

  return imageSrc ? <img src={imageSrc} alt={image} /> : null;
};
