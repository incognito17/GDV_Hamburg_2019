#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# https://stackoverflow.com/questions/42753745/how-can-i-parse-geojson-with-python 
import pygeoj
import re
import requests
import geojson

def hamburg_POIs_count ( keywordString , district ):
    # keywordString =   " pubs or bars in "
    # district      =   " St. Pauli "
    # How to use:
        # define keyword to look for, iterate over set of districts in for-loop
        # words will be quoted automatically, if necessary
    keyword_count = 0 # count occurrences

    # get district id to use in data
    district_id = 0
    certain_district = "" # geojson-element
    with open("district_ids.geojson", "r") as districts_geojson:
        city_districts = geojson.load(districts_geojson)
        
        for current_district in city_districts['features']:
            # print(current_district) # results in everything in features[0]
            # print("Curr: "+current_district) # is feature
            # print("Curr+Prop: "+current_district['properties']) # is dict
            # print(current_district.keys()) # dict_keys(['type', 'id', 'geometry', 'properties'])
            # print(current_district.properties['name']) # alter falter wie lange ich für diese scheiß eine zeile gebraucht und gerätselt habe das glaubt ihr echt nicht einfach nur wtf.
            if 'name' in current_district.properties:
                searched_name = current_district.properties['name']
                if district == searched_name:
                    certain_district = current_district
                    district_id = certain_district.id
                    # print(certain_district) # progress! ist der richtige Distrikt
                    break

        # gehe über alle Distrikte drüber
        # hast du Distrikt mit übereinstimmendem Namen gefunden
        # dann ist ein bestimmter Distrikt = der, den du gefunden hast. 
        # Ist OK, breche also ab.
        
        # Lese Ergebnisobjekt aus und mache zu einer Zahl, die für Request benötigt wird.
        district_id = str(district_id).replace('relation/','')
        print(district_id + " " + district)
        
    # see regular http request-response at api

# construct keys
    keywords = [''] # initialize array
    # append array here
# if query len 0
# if query len 1
# if query len 2
    query_request = ("[out:json][timeout:25];\r\n"
                    "area(3600078938)->.searchArea;\r\n"
                    "(\r\n"
                    "  node[\"amenity\"=\""+ keywords[0] +"\"](area.searchArea);\r\n"
                    "  way[\"amenity\"=\""+ keywords[0] +"\"](area.searchArea);\r\n"
                    "  relation[\"amenity\"=\""+ keywords[0] +"\"](area.searchArea);\r\n"
                    ""
                    "  node[\"amenity\"=\""+ keywords[1] +"\"](area.searchArea);\r\n"
                    "  way[\"amenity\"=\""+ keywords[1] +"\"](area.searchArea);\r\n"
                    "  relation[\"amenity\"=\""+ keywords[1] +"\"](area.searchArea);\r\n"
                    ");\r\n"
                    "// print results\r\n"
                    "out body;\r\n"
                    ">;\r\n"
                    "out skel qt;\r\n")
#if query len 3
#if query len 4 --> error

###

    payload = dict(data=query_request) # requires appropiate payload
    # r = requests.post('https://overpass-api.de/api/interpreter', data=payload)

    # Notiz:
    '''

    Jetzt, wo die ID richtig funktioniert, kann man ein Request mit Payload versehen.
    Dieser Request benötigt dann die Parameter von Overpass-Turbo + ID des Stadtbezirkes.
    Die auftretenden Nodes werden allesamt gezählt und als gesamte Summe zurückgegeben.
    So hat man die einzelnen Vorkommnisse nach bestimmten Parametern.

    '''

    # print(r.status_code)

    return keyword_count

#POST:
#
#   >>> payload = dict(key1='value1', key2='value2')
#   >>> r = requests.post('https://httpbin.org/post', data=payload)
#   >>> print(r.text)
#   {
#     ...
#     "form": {
#       "key2": "value2",
#       "key1": "value1"
#     },
#     ...
#   }

# Relevant Info:
# "features"{
#  "properties": {
        # "@id": "relation/28970",
        # "admin_level": "10",
        # "name": "Finkenwerder",

    # Einbauen: Overpass-Turbo -- Bars, Diskotheken, etc. (mehrere Keywords)
    # OverPass-Turbo:
    # - Wizard: admin_level=10
    # - Wizard: pubs or bars in Hamburg / "St. Pauli" etc.
    # - "@id": "relation/28931" --> 36000xxxxx / 3600028931 --> Python-Requests an Server/API stellen
    # - Geo-Koordinaten ggf. auch aus Overpass ziehen oder GeoDatenJSON aus _polygon-Datei einbinden
    # s.o.