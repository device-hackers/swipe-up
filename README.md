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

    <script type="text/javascript" src="https://unpkg.com/swipe-up@1.0.0/dist/swipe-up.js"></script>
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
swipeUp.browserUiState     //Access to BrowserUiState instance
swipeUp.fscreen            //Access to fscreen instance

swipeUp.isShown            //Boolean - SwipeUp visibility status 
swipeUp.isUserAgentExcluded//Boolean - Results of match for options.excludedUserAgents 

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
- [Browser UI State](https://github.com/device-hackers/browser-ui-state)
- [Detect Passive Events](https://github.com/rafrex/detect-passive-events) for [Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
- [Fscreen](https://github.com/rafrex/fscreen)

## Matrix of supported devices and browsers
See [Matrix](https://github.com/device-hackers/browser-ui-state/blob/master/docs/MATRIX.md) from Browser UI State

## Engine explanation
See [Engine](https://github.com/device-hackers/browser-ui-state/blob/master/docs/ENGINE.md) from Browser UI State