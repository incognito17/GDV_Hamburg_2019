#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# https://github.com/brandonxiang/geojson-python-utils
# https://gis.stackexchange.com/questions/73768/converting-geojson-to-python-objects
import pygeoj
import re
from geopy.geocoders import Nominatim
from geopy import distance
import csv
import overpass_api as opi
from numpy import genfromtxt

geolocator = Nominatim(user_agent="KulturInHambung")

hamburg_mitte_geocode = geolocator.geocode("Hamburg")
hamburg_mitte = hamburg_mitte_geocode.point

hamburg_coords = pygeoj.load("hamburg_city_districts.geojson")

with open('h_einkommen_distanz.csv', 'w', encoding='utf-8') as csv_file: # Datei anlegen
        writer = csv.writer(csv_file,lineterminator='\n')
        writer.writerow(["Stadtgebiet","Einkünfte","Entfernung"])

for feature in hamburg_coords:

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
    koord_plz = koord
    koord_plz = re.sub('[0-9]','',str(koord_plz))
    koord_str = koord_plz.replace(' ,','')
    # You Either Code Properly, Or You Code Long Enough To See Yourself Become Hated By Everyone On Your Team
    print(koord_str) # print(koord)

    # DISTANZ VON GEOCODE ZU GEOCODE BERECHNEN
    entfernung = distance.distance(koord.point, hamburg_mitte).kilometers # Zahl im Bereich 0-20 sind Kilometer
    entfernung = (int(entfernung*100)/float(100))    # Runden.
    print(entfernung)

    # DATEN VORBEREITEN FÜR CSV
    skorna_array = koord_str.split(', ')
    print(skorna_array) # Super krasses Array mit allen wichtigen Informationen, yo.
    while len(skorna_array) > 1:
            del skorna_array[1]
            print(skorna_array)
    print(skorna_array)

    # WRITE INCOME FROM OTHER CSV

    # if skorna_array[0] = row_in hamburg_einkommen.csv
        # add einkommen
    with open('hamburg_einkommen.csv', 'r', encoding='utf-8') as ham_ek:
        csvReader = csv.reader(ham_ek)
        for row in csvReader:
            important_row = str(row).split(';')
            sgb = re.sub('[:\'}]', '', important_row[0]) # Stadtgebiet
            sgb = sgb.replace('[','')
            sgb = sgb.replace('Ã¼','ü')
            sgb = sgb.replace('Ã¶','ö')
            sgb = sgb.replace('Ã¤','ä')
            sgb = sgb.replace('ÃŸ','ß')
            # sgb = sgb.replace('.','. ') # St.Pauli / St.Georg --> St. Pauli  / St. Georg
            if (skorna_array[0] == sgb) or ((skorna_array[0] in sgb) and ("und" in sgb)): # "Waltershof und Finkenwerder;31649,00"
                super_ugly_coding = important_row[1].split(',') # '94234, 00]' --> 94234
                einkommen = re.sub('[:\'}]', '', super_ugly_coding[0]) # Einkommen
                skorna_array.append(einkommen)
    print(skorna_array)

    skorna_array.append(entfernung)
    print(skorna_array)

    # CSV SCHREIBEN
    with open('h_einkommen_distanz.csv', 'a', encoding='utf-8') as csv_file: # append
        writer = csv.writer(csv_file,lineterminator='\n',delimiter=",")
        writer.writerow(skorna_array)

# For-Loop-End
print("\r\nFinished")