import * as React from "react"
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import { Card } from "react-bootstrap";
// import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

// deckDeckGoHighlightElement();

const IndexPage = ({ data }) => {
  // console.log(data.allMarkdownRemark.nodes)
  const links = data.allMarkdownRemark.nodes.map(node2link);
  const node = data.allMarkdownRemark.nodes[0];
  console.log("slug", node.frontmatter.slug);
  console.log("title", node.frontmatter.title);
  return (
    <main className="container" style={{ fontFamily: "Roboto", maxWidth: "1080px" }}>
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
      {links}
    </main>
  );
};

const node2link = (node) => (
  <Card style={{ marginBottom: "1.5rem" }}>
    <Card.Body>
      <Card.Title className="card-title">
        {node.frontmatter.title}
      </Card.Title>
      <Card.Text>
        {node.frontmatter.description}
      </Card.Text>
      <div className="text-center">
        <Link to={node.frontmatter.slug}>
          Read full post
        </Link>
      </div>
    </Card.Body>
  </Card>
);

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      nodes {
        html
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          slug
          title
          description
        }
      }
    }
  }
`

export default IndexPage;
