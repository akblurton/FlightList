# FlightList
## Example Flight finder application built using AngularJS

This is an example app for displaying a list of flights from 2 given cities. These can be additionally sorted and filtered by price, duration, departure time and # of changes.

## API

All data supplied to the application is fake, and is supplied via static .json files as no back-end system is in place.

### A note on api/search/<id>/<id>.json

All search API results are generated using `tools/flight-generator.js`. This will produce 100x99 files for every city combination. For each combination a random 3-6 flights are generated.

### API request methods

Currently all api methods are requested via GET. This is for ease of use during development as a static expressjs server was used (for browser-sync) which disables POST requests. This behaviour can be changed by modifying the configuration in `js/flight.js`#

### Login/Registration

Without any back-end system in place or appropriate storage mechanism. Login/registration will always appear to succeed.


## HTML Structure/Clarity

Twitter Bootstrap classes were used to produce markup and styles in an agile fashion. As such the HTML can appear cluttered. Optimally this would be replaced with LESS mixins within `less/flight.less`, however the inclusion of the bootstrap LESS files increases compilation time massively.

## JavaScript Configuration

Without the use of a dependency/module loader such as requirejs or browserify, the configuration for the application is stored in a function called config(). This method uses jQuery's $.extend method to produce a copy of the object upon request to prevent outside modification.

## Bootstrap Theme

The original bootstrap theme was not used in this application, the [yeti bootswatch theme](https://bootswatch.com/yeti/) was used instead.

## Mobile Support

With the use of bootstrap styles, the application is designed for desktop, tablet & mobile devices.