#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# https://stackoverflow.com/questions/42753745/how-can-i-parse-geojson-with-python 
import pygeoj
import re
import requests
import geojson
import json
import time

def hamburg_POIs_count_fast ( keywordString , district ):
    '''
    # keywordString =   "bar or pub or nightclub or cinema or theatre or museum in"

    # district      =   "St. Pauli"

    # How to use:
        # define keyword to look for, iterate over set of districts in for-loop
        # words will be quoted automatically, if necessary
    '''
    keyword_count = [] # count occurrences

    # get district id to use in data
    district_id = 0
    # district = district.replace('.','. ') # St.Pauli / St.Georg --> St. Pauli  / St. Georg
    
    certain_district = "" # geojson-element
    with open("district_ids.geojson", "r") as districts_geojson:
        city_districts = geojson.load(districts_geojson)
        
        for current_district in city_districts['features']:
            if 'name' in current_district.properties:
                # ERROR IN UMLAUTE!!!
                searched_name = current_district.properties['name']

                searched_name = searched_name.replace('Ã¼','ü')
                searched_name = searched_name.replace('Ã¶','ö')
                searched_name = searched_name.replace('Ã¤','ä')
                searched_name = searched_name.replace('ÃŸ','ß')

                if district == searched_name:
                    certain_district = current_district
                    district_id = certain_district.id
                    # print(certain_district) # ist der richtige Distrikt
                    break

        # gehe über alle Distrikte drüber
        # hast du Distrikt mit übereinstimmendem Namen gefunden
        # dann ist ein bestimmter Distrikt = der, den du gefunden hast. 
        # Ist OK, breche also ab.
        
        # Lese Ergebnisobjekt aus und mache zu einer Zahl, die für Request benötigt wird.
        district_id = str(district_id).replace('relation/','')
        print(district_id + " " + district)
        
    # construct keys
    keywords = [''] # initialize array
    query_request = ""

    keywordString = keywordString.replace(' in ','')
    keywords = keywordString.split(' or ')
    print(keywords)

    areacode = 3600000000 # len(areacode) --> 10
    district_id_int = int(district_id)
    areacode += district_id_int # Sag was de willst, aber das ist clever, ne?
    areacode = str(areacode)

    # if query len != 6
    if len(keywords) != 6:
        print("Six Keywords. No more, no less.")
        quit()
    #if query len 6
    if len(keywords) == 6:
        query_request = ("[out:json][timeout:25];\r\n"
                        "area("+areacode+")->.searchArea;\r\n"
                        "// Hochschule Mannheim, GDV-Lecture: Project Hamburg.\r\n"
                        "(\r\n"
                        "  node[\"amenity\"=\""+ keywords[0] +"\"](area.searchArea);\r\n"
                        ""
                        "  node[\"amenity\"=\""+ keywords[1] +"\"](area.searchArea);\r\n"
                        ""
                        "  node[\"amenity\"=\""+ keywords[2] +"\"](area.searchArea);\r\n"
                        ""
                        "  node[\"amenity\"=\""+ keywords[3] +"\"](area.searchArea);\r\n"
                        ""
                        "  node[\"amenity\"=\""+ keywords[4] +"\"](area.searchArea);\r\n"
                        ""
                        "  node[\"tourism\"=\""+ keywords[5] +"\"](area.searchArea);\r\n" # Tourism Required for Museum
                        ");\r\n"
                        "// print results\r\n"
                        "out body;\r\n"
                        ">;\r\n"
                        "out skel qt;\r\n")
###
    time.sleep(0.2)
    payload = dict(data=query_request) # requires appropiate payload
    time.sleep(12) # HTTP 429 Avoidance Clause. --> https://overpass-api.de/api/status
    # maximum required sleep on its own:        90 sec
    # maximum required sleep in total process:  75 sec
    # absolute minimum required sleep for 429:  10 sec
    # "2" sec worked fine for a long period.

    r = requests.post('https://overpass-api.de/api/interpreter', data=payload)

    time.sleep(0.25) #Timeouthandling

    print(r.status_code)

    if r.status_code != 200:
        print("ERROR IN HTTP CODE: " + str(r.status_code) + " at " + district)
        print(r.headers)
        print(r.text)
        quit() # Quit on Error. We don't want incomplete databases.

    # print(r.text)  
    # es werden Elemente ausgegeben. # Jetzt müssen die nur zusammengezählt werden.

    # (POI_counts[0]) # bars
    # (POI_counts[1]) # nightclub (disco)
    # (POI_counts[2]) # cinema
    # (POI_counts[3]) # theatre
    # (POI_counts[4]) # museum

    # bar or pub or nightclub or cinema or theatre or museum in
    
    keyword_text = r.text
    # Calculate Occurences
    bars_and_pubs = keyword_text.count('\"amenity\": \"pub\",') + keyword_text.count('\"amenity\": \"bar\",')
    # Append Keyword_Count (Occurences) Array
    keyword_count.append(bars_and_pubs)
    keyword_count.append(keyword_text.count('\"amenity\": \"nightclub\",'))
    keyword_count.append(keyword_text.count('\"amenity\": \"cinema\",'))
    keyword_count.append(keyword_text.count('\"amenity\": \"theatre\",'))
    keyword_count.append(keyword_text.count('\"tourism\": \"museum\",')) # Tourism Required for Museum, whyever
    
    printcount = keyword_count
    print("Keywords appear:")
    print("Bars/Pubs: " +str(printcount[0]) + " times in "+district)
    print("Nightclub: " +str(printcount[1]) + " times in "+district)
    print("Cinema: " +str(printcount[2]) + " times in "+district)
    print("Theatre: " +str(printcount[3]) + " times in "+district)
    print("Museum: " +str(printcount[4]) + " times in "+district)

    # requests.get('https://overpass-api.de/api/kill_my_queries')
    return keyword_count

#######################

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

''''
# Node representing POI
# Elements --> type --> "node"

200
{
  "version": 0.6,
  "generator": "Overpass API 0.7.55.7 8b86ff77",
  "osm3s": {
    "timestamp_osm_base": "2019-06-06T12:38:02Z",
    "timestamp_areas_base": "2019-06-06T12:19:03Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [

    {
        "type": "node",
        "id": 724276519,
        "tags": {
            "amenity": "pub",
            "name": "Roxie"
        }
    },
    {
        "type": "node",
        "id": 1926030069,
        "tags": {
            "amenity": "pub",
            "name": "Heimbar"
        }
    },
    {
    "type": "way",
    "id": 61414966,
    "nodes": [ n ],
    "tags": {
        "amenity": "pub",
        "name": "Roxie",    # Different ID, Same Location.
    }
    },
  ]
}
'''