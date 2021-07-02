---
slug: "/flatmates"
date: "2019-01-03"
title: "Matching rabbit owners and flatmates with Elasticsearch"
description: "These are some of the hundreds of new listings on Flatmates.com.au. Every day, we try to match these listings to make the process of finding a flatmate as easy as possible. But, how? Well, you may have guessed from the title that we base our secret recipe on Elasticsearch – and, of course, on lots of data."
image: "flatmates.webp"
---

# Matching rabbit owners and flatmates with Elasticsearch

_"I'm a 23 year old on a working-holiday visa and am looking for a place to call
home for the next 3/4 months."_ Or, _"Big bright room, nice living area with
small sunny kitchen out to a lovely garden with a little ocean view"._ But also,
_"I work full time 7 to 4PM, 5 days a week. My cats live outside, they have
their own cat run so are no bother"._

These are some of the hundreds of new listings on Flatmates.com.au. Every day,
we try to match these listings to make the process of finding a flatmate as easy
as possible. But, how? Well, you may have guessed from the title that we base
our secret recipe on Elasticsearch – and, of course, on lots of data. Our
engineering team faced many challenges when developing Flatmates.com.au. The
search engine behind it matches people to properties all across Australia. We
wanted to create the best shared living experience possible. Let's explore some
of these challenges and how we overcame them in more detail.

<hr>

## Elasticsearch in a nutshell

The engineering team, in its current form, joined the project a few months ago.
Our first big task together was to improve the aforementioned matching algorithm.
It uses Elasticsearch, which the team knew little or nothing about. So, we
started with the basics: what is Elasticsearch? [According to Wikipedia](https://en.wikipedia.org/wiki/Elasticsearch),
_"Elasticsearch is a search engine that provides a distributed,
multitenant-capable full-text search engine with an HTTP web interface and
schema-free JSON documents"_. Basically, we're talking about a web-based
[NoSQL database](https://en.wikipedia.org/wiki/NoSQL) based on JSON documents.
It can achieve fast search responses and it is designed to scale. Elasticsearch
ranks [8th among databases](https://db-engines.com/en/system/Elasticsearch) and
1st as a search engine. If you're interested in seeing the level of performance
possible, visit [Elasticsearch Benchmarks](https://elasticsearch-benchmarks.elastic.co/).
Well, nice to make your acquaintance Elasticsearch!

<hr>

## Conclusions

Our team took on the challenge of improving the existing search engine of
[Flatmates.com.au](https://flatmates.com.au/) using Elasticsearch. None of us
was particularly familiar with the technology in the beginning but thanks to
Elasticsearch's flexibility and ease of use we've succeeded in just a few weeks.
We are currently rolling out a new version of email alerts based on our brand
new Elasticsearch engine and soon we will replace all of our existing search
features. So, stay tuned for better results and keep searching. Go team!

<hr>

<cite>This article is also available on [REA Tech Block](https://www.rea-group.com/blog/matching-rabbit-owners-and-flatmates-with-elasticsearch/)</cite>
