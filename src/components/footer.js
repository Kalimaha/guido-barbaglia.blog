import React from "react"
import Row from "react-bootstrap/Row";

import { Link } from "gatsby";
import { HzSpacer } from "../components/hzSpacer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLinkedin, faReddit, faFacebook } from "@fortawesome/free-brands-svg-icons";

export const Footer = ({ title, slug }) => {
  const encodedTitle = encodeURI(title);
  const encodedUrl = encodeURI(`https://guido-barbaglia.blog${slug}`);
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`

  return (
    <Row>
      <hr />
      <div style={{ marginBottom: "1.5rem", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} size="2x" title="Homepage" />
        </Link>
        <HzSpacer />
        <a target="_blank" href={twitterURL} rel="noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" title="Share on Twitter" />
        </a>
        <HzSpacer />
        <FontAwesomeIcon icon={faLinkedin} size="2x" title="Share on LinkedIn" />
        <HzSpacer />
        <FontAwesomeIcon icon={faReddit} size="2x" title="Share on Reddit" />
        <HzSpacer />
        <FontAwesomeIcon icon={faFacebook} size="2x" title="Share on Facebook" />
      </div>
      <hr />
    </Row>
  )
};
