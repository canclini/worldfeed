# stream and visualize Satori Worldfeed 

## about
The idea is to consume the [big rss feed](https://www.satori.com/channels/big-rss) as a stream from [Satori](https://www.satori.com/), enrich each message with Spark Structured Streaming and visualize it in a browser app.

The Satori stream gathers more than 6.5 million rss feeds. The stream is consumed as websocket with a python function and written into the kafka topic *world-feed*.
Spark streaming is then used to read from the topic into a streaming dataframe which is enhanced with 2 informations:

1. Country of the server the message is comming from
2. The language of the message

The stream aggregates the message count by a 15 minute time window, the `country_code` and the language. All updates are written every 5 seconds into a second kafka topic *enriched-feed*.

The visualisation is done with a [node.js](https://nodejs.org) app consuming the kafka topic and sending the message via websockets to all connected browsers where a [React](https://facebook.github.io/react/) app is handling the update of [highcharts](https://www.highcharts.com/).

## system architecture
![System Architecture Data Streaming](documentation/SystemArchitectureDataStreaming.png?raw=true)

## setup

### Kafka
The Satori feed is read by the python script `Satori2Kafka.py` which writes each message as json to a kafka topic. Therefore a kafka server needs to be running. On a Mac you can install kafka as simple as `brew install kafka`

### Python
The Code is running on Python 3.5. To install the necessary libraries run
```
pip install -r requirements.txt
```

### Node.js
the visualisation part is done in [node.js](https://nodejs.org) with [React](https://facebook.github.io/react/) and [highcharts](https://www.highcharts.com/). So you need node.js and npm installed. 
Run `npm install` in the visualize directory to install the dependencies.

### jupyter / spark
You need a jupyter server running with a pyspark kernel running spark 2.1.1. make sure that the kafka package is loaded. `--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.1.1`

## run the code
1. run kafka `bin/kafka` and make sure to have a topic named `world-feed` and a topic named `enriched-feed`. (see commands below)
2. open the notebook `worldfeed.ipynb` and run it. This will also start the satori2kafka consumer.
3. change to the visualize directory and run `node server/server.js`. 
4. open http://localhost:3001 to see the output.

## commands
* start the kafka service by running `bin/kafka`
* list the registered kafka topics:
```
kafka-topics --list --zookeeper localhost:2181
```
* register a new kafka topic
```
kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic world-feed
```
* read the kafka stream on the command line:
```
kafka-console-consumer --bootstrap-server localhost:9092 --topic world-feed --from-beginning
```
* write to the kafka stream from the command line:
```
kafka-console-producer --broker-list localhost:9092 --topic world-feed
```
