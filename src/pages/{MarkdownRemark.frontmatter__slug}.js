import React from "react"
import Seo from "../components/Seo";

import { graphql } from "gatsby"
import { findImage } from "../helpers";
import { Footer } from "../components/Footer";
import { Commons } from "../components/Commons";
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

deckDeckGoHighlightElement();

export default function Template({
  data,
}) {
  const imageNodes = data.allImageSharp.nodes;
  const image = findImage(imageNodes, data.markdownRemark.frontmatter.image);

  return (
    <div
      className="container"
      style={{ fontFamily: "Roboto", backgroundColor: "#171717" }}
    >
      <Commons data={data} />
      <Seo
        title={data.markdownRemark.frontmatter.title}
        description={data.markdownRemark.frontmatter.description}
        image={`/${image.original.src}`}
      />
      <div style={{ minHeight: "1.5rem", height: "1.5rem" }}>
        &nbsp;
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      <Footer title={data.markdownRemark.frontmatter.title}/>
    </div>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        image
        description
        date(formatString: "MMMM DD, YYYY")
      }
    }
    allImageSharp {
      nodes {
        gatsbyImageData(width: 350, formats: NO_CHANGE, placeholder: DOMINANT_COLOR)
        original {
          src
        }
      }
    }
  }
`
