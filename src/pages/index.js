import React from "react"
import Seo from "../components/seo";

import { Card, Row, Col, Image } from "react-bootstrap";
import { Link, graphql } from "gatsby";
import { Commons } from "../components/commons";

const IndexPage = ({ data }) => {
  const links = data.allMarkdownRemark.nodes.map(node2link);

  return (
    <main className="container" style={{ fontFamily: "Roboto" }}>
      <Commons />
      <Seo />
      <div style={{ minHeight: "1.5rem", height: "1.5rem" }}>
        &nbsp;
      </div>
      <Row>
        {links}
      </Row>
    </main>
  );
};

const node2link = (node) => {
  console.log("==> image", node.frontmatter.image)
  return (
    <Col xs={12} md={3} style={{ marginBottom: "1.5rem" }}>
      <Card style={{ marginBottom: "1.5rem" }} className="h-100" key={node.frontmatter.slug}>
        <Image src={`${node.frontmatter.image}`} />
        <Card.Body>
          <Card.Title className="card-title text-center">
            {node.frontmatter.title}
          </Card.Title>
          <Card.Text style={{ textAlign: "justify" }}>
            {node.frontmatter.description}
          </Card.Text>
          <div className="text-center">
            <Link to={node.frontmatter.slug}>
              read full post
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
};

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
          image
        }
      }
    }
  }
`

export default IndexPage;
