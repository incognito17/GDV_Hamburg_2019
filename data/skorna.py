#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# https://github.com/brandonxiang/geojson-python-utils
# https://gis.stackexchange.com/questions/73768/converting-geojson-to-python-objects
import pygeoj
import re
from geopy.geocoders import Nominatim
from geopy import distance
import csv
import time
import overpass_api as opi

geolocator = Nominatim(user_agent="KulturInHambung")

hamburg_mitte_geocode = geolocator.geocode("Hamburg")
hamburg_mitte = hamburg_mitte_geocode.point

hamburg_coords = pygeoj.load("hamburg_city_districts.geojson")


with open('skorna_datasafe.csv', 'w') as csv_file: # Datei anlegen
        writer = csv.writer(csv_file,lineterminator='\n')
        writer.writerow(["Stadtteil","Stadtbezirk","Stadt","Land","Entfernung","Bars","Diskotheken","Kinos","Theater","Museeen"])

time.sleep(0.1) # Timeouthandling

for feature in hamburg_coords:
    # ERZEUGT STADTTEILNAMEN
    property_stadtteil = str(feature.properties).split(': ')
    stadtteil = re.sub('[:\'}]', '', property_stadtteil[1])
    stadtteil = stadtteil.replace('Ã¼','ü')
    stadtteil = stadtteil.replace('Ã¶','ö')
    stadtteil = stadtteil.replace('Ã¤','ä')
    stadtteil = stadtteil.replace('ÃŸ','ß')
    # print(stadtteil)

    # ERZEUGT STADTTEIL, STADTBEZIRK, STADT, LAND
    koord = geolocator.geocode(stadtteil + ", Hamburg")
    koord_plz = koord
    koord_plz = re.sub('[0-9]','',str(koord_plz))
    koord_str = koord_plz.replace(' ,','')
    # You Either Code Properly, Or You Code Long Enough To See Yourself Become Hated By Everyone On Your Team
    print(koord_str) # print(koord)
    ############### FEHLER -- UNWICHTIGE INFORMATIONEN! ####################

    #Timeouthandling
    time.sleep(0.1)
    # DISTANZ VON GEOCODE ZU GEOCODE BERECHNEN
    entfernung = distance.distance(koord.point, hamburg_mitte).kilometers # Zahl im Bereich 0-20 sind Kilometer
    entfernung = (int(entfernung*100)/float(100))    # Runden, bruder.
    # print(entfernung)

    # DATEN VORBEREITEN FÜR CSV
    skorna_array = koord_str.split(', ')
    skorna_array.append(entfernung)
    print(skorna_array) # Super krasses Array mit allen wichtigen Informationen, yo.

    # ERZEUGT POINTS OF INTERESTS
    print(stadtteil)
    # count them up in hamburg_POIs_count, assign them integers
    bar_count = opi.hamburg_POIs_count("bar or pub in ", stadtteil)
    disco_count = opi.hamburg_POIs_count("nightclub in ", stadtteil)
    cinema_count = opi.hamburg_POIs_count("cinema in ", stadtteil)
    theatre_count = opi.hamburg_POIs_count("theatre in ", stadtteil)
    museum_count = opi.hamburg_POIs_count("museum in ", stadtteil)

    # Reihenfolge wie oben:
    skorna_array.append(bar_count)
    skorna_array.append(disco_count)
    skorna_array.append(cinema_count)
    skorna_array.append(theatre_count)
    skorna_array.append(museum_count)
    
    # Einbauen: Overpass-Turbo -- Bars, Diskotheken, etc. (mehrere Keywords)
    # OverPass-Turbo:
    # - Wizard: admin_level=10
    # - Wizard: pubs or bars in Hamburg / "St. Pauli" etc.
    # - "@id": "relation/28931" --> 36000xxxxx / 3600028931 --> Python-Requests an Server/API stellen

    # CSV SCHREIBEN
    with open('skorna_datasafe.csv', 'a') as csv_file: # append
        writer = csv.writer(csv_file,lineterminator='\n',delimiter=",")
        writer.writerow(skorna_array) # hier ggf. noch Darstellung anpassen

    # Timeouthandling
    time.sleep(0.25) 
    # print(feature.geometry.type)
    # print(feature.geometry.coordinates)
    # print(feature.properties)