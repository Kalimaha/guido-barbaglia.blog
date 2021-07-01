import React from "react"
import Seo from "../components/seo";
import Row from "react-bootstrap/Row";

import { graphql, Link } from "gatsby"
import { Commons } from "../components/commons";
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

deckDeckGoHighlightElement();

export default function Template({
  data,
}) {
  return (
    <div
      className="container"
      style={{ fontFamily: "Roboto", backgroundColor: "#171717" }}
    >
      <Commons data={data} />
      <Seo title={data.markdownRemark.frontmatter.title} />
      <div style={{ minHeight: "1.5rem", height: "1.5rem" }}>
        &nbsp;
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      <Row>
        <hr/>
        <div className="text-center" style={{ marginBottom: "1rem" }}>
          <Link to="/">Go back to the home page</Link>
        </div>
        <hr/>
      </Row>
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
  }
`
