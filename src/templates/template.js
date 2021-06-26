import React from "react"
import { graphql } from "gatsby"

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="container">
      {/* <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
        <h1>{frontmatter.title}</h1>
        <span>{frontmatter.header}</span>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div> */}
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        header
      }
    }
  }
`
