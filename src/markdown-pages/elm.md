---
slug: "/elm"
date: "2016-12-08"
title: "My two cents about Elm"
description: "Elm is a young functional and strongly typed language. Oh, and it's for the front-end!"
image: "elm.webp"
---

# My two cents about Elm

The year is 2016, and _functional_ is definitely one of the strongest
buzzwords. Elm is a relatively new, functional and strongly typed language that
compiles into JavaScript and promises to make your life easier. Is that so?
I had the opportunity to try it for a little project of mine, and I took note of
what I like and what I dislike. This is a live post, and I will probably update
it in the near future, so stay tuned!

<hr>

## TL;DR

This is my first project with Elm, and I use it as a playground to test the
technology, and probably most of the issues I have experienced are due to a
poor knowledge of the language. Overall Elm is a very interesting language,
but if I had to start a new project tomorrow, I will probably pick Redux
(_which has basically the same architecture_) over Elm.

<hr>

## The Good

- **Types:** it makes easier to write and maintain your code
- **Great error messages:** it makes easier to debug your code, even when you are just a beginner.

<hr>

## The Bad

- **All in one:** with Elm the model, the view, and the controller are all mixed
  in one language. This makes the collaboration between developers and graphic
  designer more difficult. For example, with a templating system, developers can
  implement of the business logic and designer can take care of the look-and-feel.
  In Elm the page structure is defined by the model, which makes the work of
  designers more difficult.

<hr>

## The Ugly

- **Compiler:** I find annoying that you have to compile (_instead of refreshing the page_) everytime there is a change in the
  front-end. Elm also comes with `elm-reactor` that updates the page at every change, but it seems to me that it does not work
  with the `embed` mode.
- **Interoperability with JavaScript:** To interact with JavaScript libraries (_Highcharts in my case_) you are required to define
  a `port` in Elm, but also to write JavaScript code, which forces you to know (_and synch, and maintain_) two different source codes.
- **JSON parsing:** I was forced to model the JSON output of an API into Elm types to consume the service, which account for nearly
  half of my source code. Maybe there's a more generic way to _explore_ a JSON, not sure yet.
