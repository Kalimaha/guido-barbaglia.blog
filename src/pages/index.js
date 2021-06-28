import React from "react"
import Seo from "../components/seo";

import { Card, Row, Col } from "react-bootstrap";
import { Link, graphql } from "gatsby";
import { Commons } from "../components/commons";
import { StaticImage } from "gatsby-plugin-image"

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
  <Col xs={12} md={3}>
    <Card style={{ marginBottom: "1.5rem", minHeight: "200px" }} key={node.frontmatter.slug}>
      {/* <Card.Img variant="top" src="guido-barbaglia.png" /> */}
      <StaticImage src="../images/guido-barbaglia.png" alt="A dinosaur" />
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
