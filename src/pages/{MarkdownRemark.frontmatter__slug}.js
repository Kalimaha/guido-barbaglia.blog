import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet";

export default function Template({
  data,
}) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  return (
    <div
      className="container"
      style={{ fontFamily: "Roboto", maxWidth: "1080px" }}
    >
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <meta name="format-detection" content="telephone=no"></meta>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
      </Helmet>
      <div style={{ minHeight: "1.5rem", height: "1.5rem" }}>
        &nbsp;
      </div>
      <div className="row">
        {/* <div className="col-lg-4">
          <img
            src={`${frontmatter.image}`}
            className="img-fluid rounded-circle text-center"
            alt={frontmatter.title}
          />
        </div>
        <div className="col-lg-8">
          <p style={{fontSize: "22px", fontWeight: 100}} className="text-justify">
            {frontmatter.description}
            </p>
        </div> */}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        image
      }
    }
  }
`
