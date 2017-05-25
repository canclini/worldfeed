from __future__ import print_function
import socket
import json
import sys
import threading
import time
from satori.rtm.client import make_client, SubscriptionMode
from kafka import KafkaProducer

channel = "US-Bike-Sharing-Channel"
endpoint = "wss://open-data.api.satori.com"
appkey = "650Ce77b5f6f888F14addb8919D8D264"

# Kafka
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
topic = "satori-bike"

def main():

    with make_client(
            endpoint=endpoint, appkey=appkey) as client:
        print('Connected!')
        mailbox = []
        got_message_event = threading.Event()

        class SubscriptionObserver(object):
            def on_subscription_data(self, data):
                for message in data['messages']:
                    mailbox.append(message)
                    got_message_event.set()

        subscription_observer = SubscriptionObserver()
        client.subscribe(
            channel,
            SubscriptionMode.SIMPLE,
            subscription_observer)

        if not got_message_event.wait(10):
            print("Timeout while waiting for a message")
            sys.exit(1)

        while True:
            for message in mailbox:
                msg = json.dumps(message, ensure_ascii=False)
                producer.send(topic, msg.encode())
                # do not send the messages to fast for development
                time.sleep(0.1)

if __name__ == '__main__':
    main()
