import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet";
import { StaticImage } from "gatsby-plugin-image"

export default function Template({
  data,
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post-container" style={{ maxWidth: "1024px", marginLeft: "auto", marginRight: "auto", fontFamily: "Roboto" }}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="blog-post">
        <StaticImage src="../images/avatar.jpeg" alt="Guido Barbaglia" width={200} height={200} />
        <h1>{frontmatter.title}</h1>
        <span>{frontmatter.header}</span>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
        header
      }
    }
  }
`
