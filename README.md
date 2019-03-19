# Calendar of Events

<a href="https://aaronpinero.github.io/calevents/college.calevents.html">Demo in Github Pages</a>

A calendar display of events that takes UX cues from the Calendar app on iOS and the Google Calendar web app.

The original inspiration for this comes from <a href="https://codepen.io/peanav">Codepen.io</a> along with <a href="https://codepen.io/aaronpinero/pen/qLWXpM">my own forked version</a>. 

The HTML comes from a Drupal 7 view of event nodes by way of <a href="https://www.10bestdesign.com/dirtymarkup/">DirtyMarkup</a>. The intent is to use this calendar display in a Drupal theme, but it could also be used in other contexts. The repository includes an exported Drupal 7 view that was used to generate the HTML for this example.

## Rationale

The original calendar widget from Codepen will be enhanced in the following ways by this project:

- responsive design with a full desktop view
- fallback for no JavaScript
- fallback for no CSS
- event data is scraped from HTML (and not supplied as JSON) to create the array of event data; this allows the no-JavaScript fallback
- date-range limited based on available event data
- toggle between calendar view and list view

## Design

The .sketch file of the calendar design is included in the repository.