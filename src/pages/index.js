import React from "react"
import Seo from "../components/seo";

import { Link, graphql } from "gatsby";
import { Commons } from "../components/commons";
import { Card, Row, Col } from "react-bootstrap";
import { GatsbyImage } from "gatsby-plugin-image"

const findImage = (imageNodes, imageName) => imageNodes.find(x => x.original.src.includes(imageName.replace(".webp", "")));

const IndexPage = ({ data }) => {
  const imageNodes = data.allImageSharp.nodes;
  const links = data.allMarkdownRemark.nodes.map((node) => node2link(node, findImage(imageNodes, node.frontmatter.image)));

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

const node2link = (node, image) => (
  <Col xs={12} md={3} style={{ marginBottom: "1.5rem" }} key={node.frontmatter.slug}>
    <Card style={{ marginBottom: "1.5rem" }} className="h-100">
      <GatsbyImage image={image && image.gatsbyImageData} alt={node.frontmatter.title} />
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

export default IndexPage;
