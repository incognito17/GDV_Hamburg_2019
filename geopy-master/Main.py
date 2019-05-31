from geopy.geocoders import Nominatim
from geopy import distance
import csv

geolocator = Nominatim(user_agent="KulturInHambung")

hamburgCentroid = geolocator.geocode("Hamburg")

with open('stadtteile-distanz.csv') as csvfile:
    with open('berechnung.csv', mode='w') as calc_file:
                
        reader = csv.reader(csvfile, delimiter=';')
        next(reader, None) # skips header -- required
        for row in reader:
            writer = csv.writer(calc_file, delimiter=';', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            districtCentroid = geolocator.geocode(row[0])
            # district = str(geolocator.geocode(row[0])) + ", Hamburg"
            dist = distance.distance(districtCentroid.point , hamburgCentroid.point).kilometers
            writer.writerow([districtCentroid, str(dist)])
            