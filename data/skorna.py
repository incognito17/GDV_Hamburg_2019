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

complete_start_time = time.time()

hamburg_mitte_geocode = geolocator.geocode("Hamburg")
hamburg_mitte = hamburg_mitte_geocode.point

hamburg_coords = pygeoj.load("hamburg_city_districts.geojson")

with open('skorna_datasafe.csv', 'w', encoding='utf-8') as csv_file: # Datei anlegen
        writer = csv.writer(csv_file,lineterminator='\n')
        writer.writerow(["Stadtteil","Stadtbezirk","Stadt","Land","Entfernung","Bars","Diskotheken","Kinos","Theater","Museeen"])

time.sleep(0.1) # Timeouthandling

for feature in hamburg_coords:
    # Debug-Time-Measurement
    startzeit = time.time() # returns time in seconds

    # ERZEUGT STADTTEILNAMEN
    property_stadtteil = str(feature.properties).split(': ')
    stadtteil = re.sub('[:\'}]', '', property_stadtteil[1])
    stadtteil = stadtteil.replace('Ã¼','ü')
    stadtteil = stadtteil.replace('Ã¶','ö')
    stadtteil = stadtteil.replace('Ã¤','ä')
    stadtteil = stadtteil.replace('ÃŸ','ß')
    stadtteil = stadtteil.replace('.','. ') # St.Pauli / St.Georg --> St. Pauli  / St. Georg
    # print(stadtteil)

    # ERZEUGT STADTTEIL, STADTBEZIRK, STADT, LAND
    koord = geolocator.geocode(stadtteil + ", Hamburg")
    time.sleep(0.1) #Timeouthandling
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

    if len(skorna_array) > 5:
            print("Removed: "+skorna_array[2])
            del skorna_array[2]
            print(skorna_array)

    # ERZEUGT POINTS OF INTERESTS
    print("\r\n##### NOW PROCESSING: " + stadtteil + " #####\r\n")
    # count them up in hamburg_POIs_count, assign them integers
    '''
    ### Laufzeit 7.5 bis 15 Stunden! Nicht optimal!
    ### Ggf.: Lieber Query-Anfrage in overpass_api.py verändern.
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
    '''

    # Reduzierung Laufzeit auf 2-4 Stunden.
    # Bitte _fast benutzen.
    time.sleep(1)
    POI_counts = opi.hamburg_POIs_count_fast("bar or pub or nightclub or cinema or theatre or museum in ", stadtteil) 
    time.sleep(1)
    skorna_array.append(POI_counts[0]) # bars
    skorna_array.append(POI_counts[1]) # disco
    skorna_array.append(POI_counts[2]) # cinema
    skorna_array.append(POI_counts[3]) # theatre
    skorna_array.append(POI_counts[4]) # museum

    # Einbauen: Overpass-Turbo -- Bars, Diskotheken, etc. (mehrere Keywords)
    # OverPass-Turbo:
    # - Wizard: admin_level=10
    # - Wizard: pubs or bars in Hamburg / "St. Pauli" etc.
    # - "@id": "relation/28931" --> 36000xxxxx / 3600028931 --> Python-Requests an Server/API stellen

    # CSV SCHREIBEN
    with open('skorna_datasafe.csv', 'a', encoding='utf-8') as csv_file: # append
        writer = csv.writer(csv_file,lineterminator='\n',delimiter=",")
        writer.writerow(skorna_array) # hier ggf. noch Darstellung anpassen

    # Zeitinfo
    endzeit = time.time()
    process_time = endzeit - startzeit
    process_time = (int(process_time*100)/float(100)) 
    print("\r\n##### FINISHED AFTER: "+str(process_time)+" SECONDS #####")
    print("##### MOVING TO NEXT CITY DISTRICT #####\r\n")

    time.sleep(0.25) # Timeouthandling
    # print(feature.geometry.type)
    # print(feature.geometry.coordinates)
    # print(feature.properties)

# For-Loop-End
complete_end_time = time.time()
complete_time_taken = complete_end_time - complete_start_time
complete_time_taken_min = (complete_time_taken/60)
complete_time_taken_min_round = (int(complete_time_taken_min*100)/float(100))
complete_time_taken_h = (complete_time_taken_min/60)
complete_time_taken_h_round = (int(complete_time_taken_h*100)/float(100))
print("\r\n############")
print("COMPLETED AFTER: "+str(complete_time_taken_h_round)+" HOURS. ("+str(complete_time_taken_min_round)+" MINUTES.)")
print("############")