# SimpleMapboxPlanner

A simple route planner that uses Mapbox's API to get the time and distance for up to 25 locations (this is Mapbox's limit).

## How to run

To use this on your own either download the files to your server or clone the repo. You'll need to get an API key by creating a free account on Mapbox.com and pasting it in assets/js.js at line 4.

What functionality does this show?

1. Autocomplete of locations/addresses after 3 or more characters are inputted.
2. Getting route data such as total time and distance of route.
3. Drawing a static map image of the route with data retrieved from (2).
