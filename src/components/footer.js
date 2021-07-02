import React from "react"
import Row from "react-bootstrap/Row";

import { Link } from "gatsby";
import { HzSpacer } from "../components/hz-spacer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLinkedin, faReddit, faFacebook } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => (
  <Row>
    <hr />
      <div style={{ marginBottom: "1.5rem", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} size="lg" title="Homepage"/>
        </Link>
        <HzSpacer />
        <FontAwesomeIcon icon={faTwitter} size="lg" title="Share on Twitter"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faLinkedin} size="lg" title="Share on LinkedIn"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faReddit} size="lg" title="Share on Reddit"/>
        <HzSpacer />
        <FontAwesomeIcon icon={faFacebook} size="lg" title="Share on Facebook"/>
      </div>
    <hr/>
  </Row>
);
