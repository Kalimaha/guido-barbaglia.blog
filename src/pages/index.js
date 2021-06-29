import React from "react"
import Seo from "../components/seo";

import { Link, graphql } from "gatsby";
import { Commons } from "../components/commons";
import { Card, Row, Col, Image } from "react-bootstrap";

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

const node2link = (node) => (
  <Col xs={12} md={3} style={{ marginBottom: "1.5rem" }}>
    <Card style={{ marginBottom: "1.5rem" }} className="h-100" key={node.frontmatter.slug}>
      <Image src={`${node.frontmatter.image}`} style={{ width: "304px", height: "304px" }} />
      <Card.Body>
        <Card.Title className="card-title text-center">
          {node.frontmatter.title}
        </Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {node.frontmatter.description}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="text-center">
          <Link to={node.frontmatter.slug}>
            read full post
          </Link>
        </div>
      </Card.Footer>
    </Card>
  </Col>
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
          image
        }
      }
    }
  }
`

export default IndexPage;
