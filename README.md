# Schräger Wurf Demo Web Site

Some HTML/JS Demo App from an old school project with [@devtobi](https://github.com/devtobi).
With this small web application you can simulate the trajectory of a thrown ball including air resistance considerations.

![screenshot](screenshot.png)

## Installation

Just clone the repository and open the `html` file in your favourite Web Browser (though it works best in Chromium-based browsers). There are two versions available: one main version with nice material design oriented graphics and a simple version.

You can also try to find the easter egg ;-)

## "Features"

* You can change the following parameters:
  * throwing angle
  * initial height
  * initial speed
  * mass of ball
  * radius of ball
  * "expert mode" lets you also change:
    * drag coefficient c<sub>W<sub>
    * gravity
    * air density
* random input generator
* change recalculation interval for numeric calculation (10ms - 0.5s)
* option to change graph appearance:
  * only draw the ball while throwing
  * draw only the trajectory
  * draw discrete points on every interval step
  * draw both trajectory and discrete points
* zooming the coordinate system (30x50m up to ~570x1000m)
* dynamic title on the left side based on current configuration

