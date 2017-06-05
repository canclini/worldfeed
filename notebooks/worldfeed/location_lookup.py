# -*- coding: utf-8 -*-

from geolite2 import geolite2
import socket
from urllib.parse import urlparse


def extract_hostname(url):
    return urlparse(url)[1]

def get_ip_from_hostname(hostname):
    try:
        return socket.gethostbyname(hostname)
    except:
        return None

def get_location_from_ip(ip):
    result = None
    try:
        result = geolite2.reader().get(ip)
    except:
        result = None
    finally:
        geolite2.close()
    return result

def get_country_from_url(url):
    try:
        hostname = urlparse(url)[1]
        ip = socket.gethostbyname(hostname)
        result = geolite2.reader().get(ip)
        country_iso_code = result['country']['iso_code']
    except:
        country_iso_code = "unknown"
    finally:
        geolite2.close()
    return country_iso_code


def main():
    feedURL = "http://www.blogsicilia.it/tag/giuseppe-badagliacca-csa/feed/"
    feedURL = "http://www.bluecare.ch/tag/giuseppe-badagliacca-csa/feed/"
    print(get_country_from_url(feedURL))

if __name__ == '__main__':
    main()