# Swipe Up
[![npm version](https://badge.fury.io/js/swipe-up.svg)](https://badge.fury.io/js/swipe-up) 
![dependencies](https://david-dm.org/device-hackers/swipe-up.svg) 
[![build](https://travis-ci.org/device-hackers/swipe-up.svg?branch=master)](https://travis-ci.org/device-hackers/swipe-up)
[![gzipped size](http://img.badgesize.io/https://unpkg.com/swipe-up?compression=gzip)](https://unpkg.com/swipe-up)

Open in Chrome, emulate to Nexus 5X and play with different modes:
- [Swipe Up Live Demo](http://swipe-up.surge.sh/) 
- [Browser Ui State Live Demo](http://browser-ui-state.surge.sh/)

## Installation
```shell
$ npm i swipe-up
```
[![NPM](https://nodei.co/npm/swipe-up.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/swipe-up/)

Don't be afraid of caret (^) in your package.json for this dependency - [semver](http://semver.org/) will 
[be](https://adambard.com/blog/on-library-versioning/) used 
[correctly](https://bytearcher.com/articles/semver-explained-why-theres-a-caret-in-my-package-json/) for 
[sure](https://medium.com/front-end-developers/versioning-you-re-doing-it-wrong-5522bb46431) 
:hand::expressionless: :one:.:zero:.:zero:.

## Usage
In case default options will fit your needs, all you need to do is instantiate SwipeUp (when DOM is ready) and call enable():

```javascript
import SwipeUp from 'swipe-up'
  
const loadHandler = () => {
    const swipeUp = new SwipeUp() //will init DOM and listeners,
    swipeUp.enable()              //but SwipeUp will not be displayed until you enable it explicitly 
}
  
window.addEventListener('load', loadHandler)
```
Old school:
```javascript
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" 
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">

    <script type="text/javascript" src="https://unpkg.com/swipe-up"></script>
    <script>
        window.addEventListener('load', function () {
            var swipeUp = new SwipeUp()
            swipeUp.enable()
        })
    </script>
</head>
<body>
</body>
</html>
```

## Constructor Options
```javascript
let options = {
    initialOrientation: window.innerWidth > window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT',
    addImportantToBodyHeight: true,
    fixateRootElementsOnInit: true,
    scrollWindowToTopOnShow: true,
    useHtml5FullScreenWhenPossible: false,
    excludedUserAgents: /\WiPad\W/i,
    customCSS: '.fixedFlexBox { background-color: rgba(0, 0, 50, 0.7) }',
    customCSSCleanSlate: true,
    expandBodyHeightTo: '120vh',
    updateTimeout: 150,
    swipeUpContent: 'Swipe Up to continue <b>custom text</b>',
    html5FullScreenContent: 'Touch to continue <b>custom text</b>',
}
const swipeUp = new SwipeUp(options)
```
- [index.js](https://github.com/device-hackers/swipe-up/blob/master/src/swipe-up/index.js) - 
see documentation for all options
- [demo.js](https://github.com/device-hackers/swipe-up/blob/master/src/demo/index.js) -
see code for "animated" button from demo for example how UI can be customized drastically

## Public API
```javascript
//Getters:
swipeUp.browserUiState     //Access to BrowserUiState instance
swipeUp.fscreen            //Access to fscreen instance

swipeUp.isShown            //Boolean - SwipeUp visibility status 
swipeUp.isUserAgentExcluded//Boolean - Results of match for options.excludedUserAgents 
swipeUp.appliedOptions     //Returns options JSON-object which has been applied by Swipe Up after merging 
                           //all sources (default, constructor, URL)

//Methods:
swipeUp.disable()          //This and next one allows to control operational mode of SwipeUp, so you have
swipeUp.enable()           //ability to "turn-on" and "off" SwipeUp functioning according to your needs

swipeUp.showDebugWidget()  //As it sounds - you can trigger debug widget appearing via API,
swipeUp.hideDebugWidget()  //but it can be also displayed via case insensitive URL param "debugInSwipeUp",
swipeUp.toggleDebugWidget()//as well as via secret touch sequence (hold finger in the bottom right corner
                           //on Swipe Up and quickly tripple-tap in the top left corner)
```
*there is another secret touch sequence which can be communicated to users to workaround possible blocking experience
where Swipe Up may prevent product usage due to not yet supported browser or new mobile limitation/issue 
(hold finger in the bottom left corner on Swipe Up and quickly tripple-tap in the top right corner)

## Dependencies
- [![gzipped size](http://img.badgesize.io/https://unpkg.com/browser-ui-state?compression=gzip)](https://unpkg.com/browser-ui-state) 
[Browser UI State](https://github.com/device-hackers/browser-ui-state) - (used as a chassis), so own code size of Swipe Up is also about ~5 Kb (gzipped)
- [![gzipped size](http://img.badgesize.io/https://unpkg.com/detect-passive-events?compression=gzip)](https://unpkg.com/detect-passive-events) 
[Detect Passive Events](https://github.com/rafrex/detect-passive-events) - ~20 lines of [code](https://github.com/rafrex/detect-passive-events/blob/master/src/index.js) 
(used for correct cross-browser usage of 
[Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md))
- [![gzipped size](http://img.badgesize.io/https://unpkg.com/fscreen?compression=gzip)](https://unpkg.com/fscreen) 
[Fscreen](https://github.com/rafrex/fscreen) - ~60 lines of [code](https://github.com/rafrex/fscreen/blob/master/src/index.js)
(used for vendor agnostic access to the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API))

Polyfills:
- [![gzipped size](http://img.badgesize.io/https://unpkg.com/es6-object-assign?compression=gzip)](https://unpkg.com/es6-object-assign) 
[ECMAScript 6 Object.assign() polyfill](https://github.com/rubennorte/es6-object-assign) - ~40 lines of [code](https://github.com/rubennorte/es6-object-assign/blob/master/index.js) 
used for UC and QQ browsers which still (Nov'17) doesn't support Object.assign
- [![gzipped size](http://img.badgesize.io/https://unpkg.com/es6-weak-map?compression=gzip)](https://unpkg.com/es6-weak-map) 
[ECMAScript 6 WeakMap polyfill](https://github.com/medikoo/es6-weak-map) - ~70 lines of [code](https://github.com/medikoo/es6-weak-map/blob/master/polyfill.js) 
used for old Android Stock browsers and UC which still (Nov'17) doesn't support WeakMaps
- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill (inline)

## Matrix of supported devices and browsers
See [Matrix](https://github.com/device-hackers/browser-ui-state/blob/master/docs/MATRIX.md) from Browser UI State.

## Engine explanation
See [Engine](https://github.com/device-hackers/browser-ui-state/blob/master/docs/ENGINE.md) from Browser UI State.

- Swipe Up respects user-agent resources and throttles window 
[resize](https://developer.mozilla.org/en-US/docs/Web/Events/resize) and device 
[orientationchange](https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange) events with the help of
[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

- Swipe Up has to delay its calculations on above events to circumvent some silly browsers (at least Safari) 
which seems to fire resize in some cases slightly before the browser actually calculated final window
dimensions (window.innerWidth and height) resulting into window size to be reported somewhat intermediate,
and if user to press some kind of 'refresh' button (which will redisplay window size) after it - the window size 
will display updated to final values, meaning we are forced to use delay. Even above technique with 
requestAnimationFrame doesn't help to workaround this problem. All aspects of Swipe Up behavior are configurable
including mentioned delay (updateTimeout).

- Swipe Up applies its CSS styles by dynamically creating ```<style>``` tag (with ID ```swipe-up-styles``` 
just in case) and inserting it as first child into ```<head>``` so you can easily customize it using either 
traditional approach (with your own ```<style>```s which should go below Swipe Up ```<style>```) or via 
options customCSS and customCSSCleanSlate which will result into your CSS injected into the same Swipe Up's 
own ```<style>``` tag after Swipe Up's own styles.

- By default Swipe Up will try to use HTML5 
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) if user-agent will be support it,
falling back to classic "swipe up" functionality otherwise. If for some reason above API is not fitting your needs,
it can be turned-off with ```useHtml5FullScreenWhenPossible``` option

- If you need to support QQ EN, QQ CN, UC EN before 11.4.6 and/or other browsers not capable of 
[screen.orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation) - you may supply Swipe Up
with ```initialOrientation``` (which you can detect with window.innerWidth > window.innerHeight check). This will allow
Swipe Up to detect states and orientation more correctly in edge cases like on-screen keyboard and split screens.

- If you have business requirement to not show Swipe Up for example on all tablets - you will have to take care of this
requirement yourself because there is not reliable cross-browser way to detect if device is a tablet. Swipe Up could
help with this, but that would mean it should become dependent on ```Detect.js``` (To be hosted on Github soon) resulting
into bigger bundle size. Use ```excludedUserAgents``` option and supply regular expression which will list iPad and all
Android tablets which your business care of, e.g. 
```excludedUserAgents : /(?:\WiPad\W|\WTablet\W|\WNexus (?:7|9|10)\W)|(\WSM-T80\W)/i``` which will disable Swipe Up on
iPads, Firefox on any tablet, all Nexus tablets (7, 9, 10), and Samsung Galaxy Tab S 10.5.
If you already use ```Detect.js``` things may become lots simpler, as you can supply function instead of RegExp.
This function has to return true or false for current user-agent, and as so both libs can be combined like this:
```excludedUserAgents : () => Detect.Type.is(Detect.T.Tablet)```