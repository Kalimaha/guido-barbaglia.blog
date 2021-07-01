import React from "react"
import { Helmet } from "react-helmet";

const ldJSON = (data) => ({
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "http://guido-barbaglia.blog/posts/how_i_built_my_blog_with_grunt.html"
    },
    "headline": data.markdownRemark.frontmatter.title,
    "description": data.markdownRemark.frontmatter.description,
    "author": {
      "@type": "Person",
      "name": "Guido Barbaglia"
    },
    "datePublished": data.markdownRemark.frontmatter.date,
    "dateModified": data.markdownRemark.frontmatter.date,
    "publisher": {
      "@type": "Organization",
      "name": "Guido Barbaglia",
      "logo": {
        "@type": "ImageObject",
        "url": "http://guido-barbaglia.blog/guido-barbaglia.webp",
        "width": 350,
        "height": 350
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": `http://guido-barbaglia.blog/${data.markdownRemark.frontmatter.image}`,
      "height": 350,
      "width": 350
    }
  }
);

export const Commons = (data) => (
  <Helmet htmlAttributes={{ lang: 'en' }}>
    <title>Blog | Guido Barbaglia</title>

    <meta charset="utf-8" />
    <meta name="description" content="Guido Barbaglia's personal blog."></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"></meta>
    <meta name="format-detection" content="telephone=no"></meta>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>

    {data.data && data.data.markdownRemark ? (
      <script type="application/ld+json">
        {JSON.stringify(ldJSON(data.data))}
      </script>
    ) : (<script></script>)}
  </Helmet>
);
