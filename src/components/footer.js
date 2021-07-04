import React from "react"
import Row from "react-bootstrap/Row";

import { Link } from "gatsby";
import { HzSpacer } from "../components/HzSpacer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLinkedin, faReddit, faFacebook } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => (
  <Row>
    <hr />
      <div style={{ marginBottom: "1.5rem", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} size="2x" title="Homepage"/>
        </Link>
        <HzSpacer />
        <FontAwesomeIcon icon={faTwitter} size="2x" title="Share on Twitter"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faLinkedin} size="2x" title="Share on LinkedIn"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faReddit} size="2x" title="Share on Reddit"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faFacebook} size="2x" title="Share on Facebook"/>
      </div>
    <hr/>
  </Row>
);
