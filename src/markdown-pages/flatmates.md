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

##Storing VS searching data

At the core of our application is a very traditional entity-relationship (E-R)
SQL database. This database contains Flatmate's data structure that represent
our business domain model. So how can we take advantage of Elasticsearch and
its schema-less model to reconcile these two very different views of our world?
The answer is **searchable** data. A JSON representation of the original data,
constructed starting from the original dataset. One great advantage of a
searchable document is it's not tied to the original entity. It may also contain
data that does not belong at all to the original dataset. This allows us to
tailor the data to our specific search needs. For example, let's consider an
over-simplified Property entity:

```sql
Properties(
  id int NOT NULL PRIMARY KEY,
  location_id FOREIGN KEY REFERENCES Locations(id),
  rent int,
  created_at date
)
```

A possible JSON representation for a single record could be the following:

```json
{
  "id": 42,
  "rent": 250,
  "suburb": "Richmond",
  "city": "Melbourne",
  "state": "VIC",
  "has_photos": true
}
```

This example shows our searchable document containing:

- A few fields from the original dataset _(**id** and **rent**)_
- A "virtual" field _(**has_photos**)_ that may be calculated from the relationship with other entities
- A set of fields _(**suburb**, **city** and **state**)_ that have been "flattened". We pull these fields from the Location entity linked to the property, through the location_id field.

In Elasticsearch, unlike relational databases, it's not possible to store data
in separate "tables" (there's no such a thing in a schema-less relational
database) and then perform a join of the two tables. But there are several
ways to work around this, as explained in [this excellent blog post](http://rea.tech/using-elasticsearch-field-collapsing-to-group-related-search-results/). What
solution works best for us? We pull all the information required for the
search – right before the indexing of the searchable data – and store it against
the document. This is quite simple thanks to [Searchkick](https://github.com/ankane/searchkick). Searchkick provides a seamless integration between our domain model and
Elasticsearch. This occurs through the definition of **Searchable** classes.

## Surrounding Suburbs

Searching for surrounding suburbs is a perfect example of data that is not part
of the original dataset. This piece of information is not even stored in our
database. Nonetheless, we need it to answer the query: _"Find properties in
Richmond or in its vicinity"_. To make this possible, we stored all Australian
suburbs in an Elasticsearch document. It has the following structure:

```json
{
  "source_suburb": "Richmond",
  "target_suburb": "South Yarra"
}
```

Once this data is available, we can instruct Searchkick to include surrounding
suburbs. This happens in the searchable document that represents a property:

```ruby
def search_data
  attributes.merge(
    ...,
    "suburb": location.suburb,
    "city": location.city,
    "postcode": location.postcode,
    "surrounding_suburbs": SurroundingSuburbsService.find_by(location)
  )
end
```

Where `SurroundingSuburbsService` is a simple service that queries the
aforementioned index.

## Building rules incrementally

At this point of the journey, we have thousands of documents stored in
Elasticsearch. We use Elasticsearch's JSON-based RESTful interface to perform
queries. We can easily filter our properties through Searchkick as follows:

```ruby
properties = Property.search("*", "body": { "query": query })
```

Now let's say that we are looking for "Properties in Richmond or Fitzroy priced
between $150 and $300". The first half of the query can be written as:

```json
{ "terms": { "suburb": ["Richmond", "Fitzroy"] } }
```

And the price filter is defined as:

```json
{ "range": { "rent": { "gte": 150, "lte": 300 } } }
```

The overall query object is obtained by combining these rules:

```json
{
  "bool": {
    "filter": [
      { "terms": { "suburb": ["Richmond", "Fitzroy"] } },
      { "range": { "rent": { "gte": 150, "lte": 300 } } }
    ]
  }
}
```

This approach really improved our developer experience. We were able to build
and test our search engine one rule at a time. This is possible, as a query in
Elasticsearch is a simple JSON document itself making it very easy to
incrementally build complex rules by combining individual rules together. From
an implementation point of view, all we have to do is:

1. Loop through the user preferences (e.g. budget, location, etc.).
1. _"Calculate"_ the corresponding rule.
1. Merge all of these rules into a single big query.
1. Return the results to our user.
1. The same level of incremental composition can be achieved with SQL queries, but in my experience, it is very cumbersome and painful _(text analysis, string builders, heaps of if/else, etc.)_.

## NULL values

Another important difference between Elasticsearch and SQL Databases is that
it's not possible to search for `NULL` values. Let's consider the hypothetical
scenario where Clementine has a rabbit, and she's looking for accommodation for
her and her little friend. We have to make sure that all properties in the
results accept pets, in particular rabbits. This search looks like this in SQL:

```sql
SELECT *
FROM Properties AS p
WHERE p.accept_pets IS TRUE
  AND p.pets_accepted IN ('rabbit')
  OR p.pets_accepted IS NULL;
```

In the last line of the SQL statement we have `OR p.pets_accepted IS NULL`. This
includes properties that accept pets, but do not specify which type of pets.
They're probably ok with rabbits as well, but we don't know for sure. Let's try
to translate this into Elasticsearch:

```json
{
  "bool": {
    "filter": [
      { "term": { "accept_pets": true } },
      { "terms": { "pets_accepted": ["rabbit", null] } }
    ]
  }
}
```

If we try to execute this query, we'll get a result like this: _"No value
specified for terms query"_. Although it's possible to store `NULL` values in
Elasticsearch, it is not possible to use them in filters. Which means that our
result set would be incomplete. How can we help Clementine? Luckily, there's a
simple workaround for this problem. We can replace `NULL` values with a well-known
string. This operation can be executed right before indexing a new document,
just like what we did with surrounding suburbs:

```ruby
def search_data
  attributes.merge(
    ...,
    "accept_pets": accept_pets,
    "pets_accepted": pets_accepted || "N.A."
  )
end
```

With this trick in place, we can now perform the following query:

```json
{
  "bool": {
    "filter": [
      { "term": { "accept_pets": true } },
      { "terms": { "pets_accepted": ["rabbit", "N.A."] } }
    ]
  }
}
```

You're welcome, Clementine and rabbit friend!

## Bool, Should and Must

As you've noticed by now, Elasticsearch query syntax is very different from SQL.
All the examples start with the bool operator. This expresses a _"query that
matches documents matching Boolean combinations of other queries"_. These _"other
queries"_ can be of different types: filter, must, must_not and should. The
operator filter is like SQL's The key difference is that must contributes to the
result score and therefore to the ranking. Finally, for SQL aficionados, the
should operator can be the confusing one because its behaviour changes based on
which clauses it is combined with. For a full explanation, refer to the official
documentation. What's does that mean for us? Well, do you remember surrounding
suburbs? Let's say Clementine would like to live either in Coogee or in Bronte.
But we can't find any available properties in either suburb! We could return
properties that are in suburbs close by, Bondi Beach might be ok for her. We are
able to do this because we store all the neighbouring suburbs against the
property itself right before indexing the document. The search looks like this:

```json
{
  "bool": {
    "filter": [
      {
        "bool": {
          "should": [
            {
              "bool": {
                "filter": [
                  { "term": { "surrounding_suburbs.suburb": "Coogee" } },
                  { "term": { "surrounding_suburbs.postcode": "2034" } }
                ]
              }
            },
            {
              "bool": {
                "filter": [
                  { "term": { "surrounding_suburbs.suburb": "Bronte" } },
                  { "term": { "surrounding_suburbs.postcode": "2024" } }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

Each "inner" filter condition expresses a Boolean `AND`: both the suburb name
`AND` the postcode must match. We then use should to express a Boolean `OR` to
return properties located in Coogee `OR` Bronte.

## Scoring

We can say that the main goal of the search is to find all relevant documents
that best match a given query. The keyword here is relevant, this means to rank
the results through scoring. This [document](https://www.elastic.co/guide/en/elasticsearch/guide/current/scoring-theory.html) has a good explanation of how
Elasticsearch does that. The best part of scoring with Elasticsearch is the
`function_score` feature. You can alter the default behaviour to define what _"more
similar"_ means. It also allows you to "boost" some results over others. Think
about your average Google search, where the results marked with _"Ad"_ appear on
the top of your list. Earlier we helped Clementine find accommodation close to
Coogee or Bronte. There weren’t any results, so we had to return properties in
the surrounding suburbs. In that case, we are not providing Clementine with
ideal matches. How can we make sure that these results aren’t too bad despite
the constraints? We can make use of `function_score` and boost results based on a
subset of the documents fields. For example, we can prioritise all properties in
the result set based on distance. We can calculate the distance between their
location and Clementine’s original preferences, using a [The Closer, The
Better](https://www.elastic.co/guide/en/elasticsearch/guide/current/decay-functions.html) rule:

```json
{
  "query": {
    "function_score": {
      "functions": [
        {
          "gauss": {
            "location": {
              "origin": { "lat": -33.9196529, "lon": 151.254951 },
              "offset": "2km",
              "scale": "3km"
            }
          }
        }
      ]
    }
  }
}
```

Elasticsearch allows us to combine several scoring functions _(for example:
distance, budget, etc.)_ enabling to find the perfect scoring recipe, and
provide our users with more meaningful results.

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
