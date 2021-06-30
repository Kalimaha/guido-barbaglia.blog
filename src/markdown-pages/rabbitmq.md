---
slug: "/rabbitmq"
date: "2017-04-08"
title: "Microservices coreography with event streams"
description: "Reduce the coupling between microservices through the use of event streams"
image: "rabbitmq.webp"
---

# Microservices coreography with event streams

I recently had the opportunity to attend
[Fred George](https://twitter.com/fgeorge52?lang=en)'s talk
"_IoT and MicroServices in the Home_" at
[YOW! Nights](http://nights.yowconference.com.au/). The talk is available on
[YouTube](https://youtu.be/J1eTutzcGFQ) and it's strongly recommended! Another
similar talk is [Perryn Fowler](https://twitter.com/perrynfowler)'s
"_Microservices and IoT: A Perfect Match_", also available on
[YouTube](https://youtu.be/Am7edhP6G7s). These talks are somehow similar and
describe the use of event streams to "_organize_" several microservices that
monitor and control some IoT devices such as lights and sensors. I found the
topic very interesting, and I wanted to try this type of architecture myself.
The systems presented in the aforementioned talks are based on real-time data
processing, and I want to figure out whether this approach can be also used for
other use cases.

<hr>

## Edison Cars

_Edison Cars_ is an hypothetical low-cost manufacturer of electric vehicles that wants
to sell its products online. The newly born company has a shiny state-of-the-art
UI for its sales, and it needs to communicates such information to other
departments of the company, such as the warehouse, the assembly lines and
so forth and so on. There are several ways to implement an IT infrastructure
capable to support such business model.

<hr>

## Monolith

Well. No. 😬

<hr>

## Synchronous RESTful Services

A first approach consists in the implementation of several microservices, one for
each division of the company. As soon as a customer buys a new car, the sales
service stores a new record in its DB, and then it invokes all the services
required to "_implement_" the sale. Such approach is known as _services
orchestration_. Soon enough we will find out that the sales app is required to
_know too much_: it has to know which are the services required, how to invoke
them, and eventually in which order. Every time we want to add a new service,
we are required to modify the sales app to make it aware of the new app it
needs to communicate with.

<hr>

## Queues

Another solution consists in the use of queues, such as
[SQS](https://aws.amazon.com/sqs/), [Que](https://github.com/chanks/que) or
similar. With this implementation, the sole responsibility of the sales app is
to (_sell a car and_) enqueue the data about the sale. Such information is then
retrieved and processed by workers in the other services. Usually a
queue works for a single consumer, which removes the job from the queue. Therefore,
this is not an ideal solution if we need to share the same information
between several services, unless we instanciate a queue for each required service
and we enqueue the same information over and over again.

The sales app is still required to know about other services, in the form of
queues, but through this architecture it is not required to know _how_ to invoke
such services. Its sole responsibility now is to post a message to a queue.
The overall system is also more fault-tolerant, because it will keep working even
if one of the other services is down. With services orchestration, the downtime
of one of the services affects the sales app, because it is not able to communicate
with the other apps required to complete the sale. In this new model, the sales
app can complete the sale as soon as it publishes the message to the queue. Once
the faulty service is up and running again, it will simply subscribe to the queue
again and process the remaining job, without blocking the entire business.

<hr>

## Data Feeds

To make the sales app completely independent from other services, we can
introduce a data feed. A data feed is a JSON/XML representation
of one or more entities stored in the DB (_e.g. orders_) that can be consumed
by other services. Such services periodically check the feed for updates and
create a local copy of such data in their local DB. In this scenario, a
warehouse app can check the feed and order new pieces when it detects a new
order, a dashboard app can update its statistics and so son.

The sales app now is not required to know about other systems at all, new
services can be easilly added and removed, and the overall architecture is still
very fault-tolerant. In this scenario, even the downtime of a source of information
won't affect the whole system. Let's say there's a customer app, which stores
the information required for the billing and the shipment. Even if this app is
down for some reason, the fault won't affect hypothetical billing and shipping
apps, because they hold a copy of the customers information in their local DB.

This solution works well when data is not updated often and the local copy is
good enough to continue operations. On the other hand, we are stressing source
apps (_e.g. sales, customers, etc._) which are accessed often to provide fresh
data. This can potentially slow down the app when there are many downstream
systems and/or the feed is particularly heavy.

<hr>

## Event Streams

With an event stream, the sales app is required to pubilsh the sale event and
the relative data to a message broker. Downstream systems subscribe to the event
stream and get notified every time there is a new event. The advantages are the
same of the Data Feed solution, but we have added an extra layer between the data
source and its consumers. The message broker is an external system, therefore
the sales app is not queried constantly. Consumer systems read directly from the
stream and store the data locally, achievieng the same decoupling and resiliency
goals. Is this the silver bullet then? Can I use it for any use case?

<hr>

## RabbitMQ Hands-on

I've tried to build the microservices for _Edison Cars_ using
[RabbitMQ](https://www.rabbitmq.com/), as suggested by Fred George in his talk.
Other possible technologies are [AWS Kinesis](https://aws.amazon.com/kinesis)
and [Apache Kafka](https://kafka.apache.org/), even though RabbitMQ is simple
enough to play with it and quickly test some ideas.  The source code of my
little project is available on
[GitHub](https://github.com/Kalimaha/event-stream-playground). In this
implementation, for each new order in the sales app, a new record is
stored in the DB, and the event is published on the [exchange](https://www.rabbitmq.com/tutorials/tutorial-three-ruby.html).
Basically, an exchange is an object that receives messages and pushes them to
queues:

```ruby
def publish(order:)
  connection  = open_connection
  channel     = connection.create_channel
  exchange    = channel.fanout('orders', :durable => true)
  message     = create_message(order)

  exchange.publish(message, :persistent => true)

  connection.close
end
```

The data source needs to open a connection, create a channel and an exchange
(_both idempotent operations_), and then publish the message. The code on the
consumer side is very similar:

```ruby
def consume(queue_name, block)
  connection  = open_connection
  channel     = connection.create_channel
  exchange    = channel.fanout('orders', :durable => true)
  queue       = channel.queue(queue_name, :auto_delete => false)
  queue.bind(exchange)

  begin
    queue.subscribe(:block => block, :manual_ack => true) do |delivery_info, properties, body|
      json = JSON.parse(body)
      if Order.find_by_external_id(json['external_id']).nil?
        order = Order.new(order_data(json))
        order.save
      end
    end
  rescue Interrupt => _
    channel.close
    connection.close
  end
end
```

Once the consumer receives a message from the exchange, it looks in the DB to
determine whether it already has a copy of that order, and it stores it
otherwise. This mechanism will avoid duplicate copies of the data and wrong
operations based on it. I'm failry sure that the customer wants to buy only
_one_ car at the time!

<hr>

## Disadvantages

All good then? Well, not really. Let's take a look at the weak points of this
architecture:

* <b>If a tree falls in a forest and no one is around to hear it, does it make a sound?:</b> Not in the RabbitMQ world. If the source publishes a message to the exchange with no existing queue, the message is discarded, lost. For example, if the sales app sells a car before any other service had the chance to subscribe to its exchange, the orders are lost and never delivered to anyone. Unlikely, but it may happen. The solution that I've implemented so far is to create a queue in the datasource, named _history_. Basically, the data source produces the data and publishes it to the exchange, but it also "_consumes_" it in a sort of backup queue. By doing this we ensure that there's always at least one consumer of the queue, which is the data source itself.

* <b>Adding Services:</b> when a new consumer subscribes to the exchange, it reads the data from that moment on. For example, imagine that you want to add a new service to your architecture to create statistics over the sales. This service will not have access to the historical timeseries of such sales, but only to the sales made from the moment it subscribes to the exchance on. To address this problem, I added a small [Rake](https://github.com/ruby/rake) task, that subscribe to the aforementioned _history_ queue, and populates the DB. This is the same as having a feed, even though we are still dealing with the event stream with no overhead for the datasource.

<hr>

## Conclusions

So, what's the outcome of my little experiment? The advantages of queues, data
feeds and event streams in terms of decoupling and resiliency are obvious.
Although event streams are very interesting, it is possible to use this solution
in selected use cases only.

For example, should _Edison Cars_ share its sales data through streams? Well,
as usual, it depends. Streams shouldn't be used for, let's say, a billing app.
Such data should be always available at any point in time, while with the
stream, the information lives in the stream until someone consumes it. Although
it is possible to make the data persistent in the exchange, it's not
reccomended, for at least two reasons. By doing so, we are creating a copy of
the data that should live only in the DB. Furthermore, this data may become
outdated and can potentially lead to wrong outcomes.

On the other hand, there are use cases where event streams can be preferred to
data feeds. _Edison Cars_ could decide to send a confirmation email to the user
once a sale has been made, and this scenario can be easilly implemented with a
mailing app that "_listen_" to the exchange and sends a message for every new
object in the queue. A list of possible use cases is available on the
[Kafka website](https://kafka.apache.org/uses), and it includes messaging,
metrics,log aggregation, etc. And, of course,  real-time data processing for IoT
devices, as per the talks that inspired this post. 🙂

<hr>

## Resources

* Fred George's [IoT and MicroServices in the Home](https://youtu.be/J1eTutzcGFQ)
* Perryn Fowler's [Microservices and IoT: A Perfect Match](https://youtu.be/Am7edhP6G7s)
* JR D'Amore's [Scaling Microservices with an Event Stream](https://www.thoughtworks.com/insights/blog/scaling-microservices-event-stream)
* [AWS SQS](https://aws.amazon.com/sqs/)
* [Que](https://github.com/chanks/que)
* [RabbitMQ](https://www.rabbitmq.com/)
* [AWS Kinesis](https://aws.amazon.com/kinesis/)
* [Apache Kafka](https://kafka.apache.org/)
* [My source code](https://github.com/Kalimaha/event-stream-playground)
