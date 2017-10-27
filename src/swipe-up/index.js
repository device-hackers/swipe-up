import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug/debug-widget'
import DebugWidgetTrigger from './debug/debug-widget-trigger'
import EventThrottle from '../utils/event-throttle'
import $ from '../utils/dom'

//Private scope
const swipeUpText = 'Swipe up to continue in full-screen mode'
const html5FullScreenText = 'Touch to continue in full-screen mode'
const localStorageDisableKey = 'SwipeUp._disabled'

let win = new WeakMap()
let swipeUpOverlay = new WeakMap()
let debugWidget = new WeakMap()
let elementToFix = new WeakMap()

let showOrHide = (self) => {
    let disabled = (win.get(self).localStorage.getItem(localStorageDisableKey) === 'true')

    if (!disabled && self.browserUiState.state === 'COLLAPSED') {
        $(swipeUpOverlay.get(self)).show()
    } else if (swipeUpOverlay.get(self).style.display !== 'none') {
        $(swipeUpOverlay.get(self)).hide()
    }
}

export default class SwipeUp {
    constructor(anElementToFix = null, initialOrientation = null, windowObj = window) {
        if (!windowObj.document.body) {
            throw new Error('Swipe Up should be instantiated on window load when DOM is ready')
        }
        win.set(this, windowObj)

        if (anElementToFix) {
            elementToFix.set(this, anElementToFix)
        }
        Array.from(win.get(this).document.body.children).forEach((el) => el.style.position = 'fixed')

        swipeUpOverlay.set(this, win.get(this).document.createElement('div'))
        swipeUpOverlay.get(this).className = 'swipeUpOverlay'
        swipeUpOverlay.get(this).innerHTML = `<div class='fixed'>${swipeUpText}</div>`
        win.get(this).document.body.appendChild(swipeUpOverlay.get(this))

        let debugWidgetTrigger = new DebugWidgetTrigger(this, swipeUpOverlay.get(this), win.get(this))

        //expose browser-ui-state and fscreen as part of swipe-up API
        this.browserUiState = new BrowserUiState(initialOrientation, win.get(this))
        this.fscreen = this.browserUiState.fscreen

        debugWidgetTrigger.shouldShowWidgetOnLoad ? this.showDebugWidget() : null

        const resizeHandler = (event) => {
            showOrHide(this)
            debugWidget.get(this) ? debugWidget.get(this).update() : null
        }

        new EventThrottle('resize', 'optimizedResize', win.get(this))
        new EventThrottle('orientationchange', 'optimizedOrientationchange', win.get(this))
        new EventThrottle('scroll', 'optimizedScroll', win.get(this))
        new EventThrottle('touchmove', 'optimizedTouchmove', win.get(this))
        win.get(this).addEventListener('optimizedResize', resizeHandler)
        win.get(this).addEventListener('optimizedOrientationchange', resizeHandler)
        win.get(this).addEventListener('optimizedScroll', resizeHandler)
        win.get(this).addEventListener('optimizedTouchmove', resizeHandler)
    }

    get isShown() {
        return swipeUpOverlay.get(this).style.display === 'block'
    }

    disable() {
        //TODO maybe store initial position of root body elems and body height and restore on disable?
        win.get(this).localStorage.setItem(localStorageDisableKey, 'true')
        showOrHide(this)
    }

    enable() {
        //TODO findout when and why CP got position:absolute override for #app
        //Array.from(win.get(this).document.body.children).forEach((el) => el.style.position = 'fixed')
        win.get(this).document.body.style.height = '110vh' //Required for Safari portrait
        win.get(this).localStorage.setItem(localStorageDisableKey, 'false')
        showOrHide(this)
    }

    showDebugWidget() {
        if (!debugWidget.get(this)) {
            debugWidget.set(this, new DebugWidget(this, swipeUpOverlay.get(this)))
        }
        debugWidget.get(this).show()
    }

    hideDebugWidget() {
        if (!debugWidget.get(this)) {
            debugWidget.set(this, new DebugWidget(this, swipeUpOverlay.get(this)))
        }
        debugWidget.get(this).hide()
    }

    toggleDebugWidget() {
        if (!debugWidget.get(this)) {
            debugWidget.set(this, new DebugWidget(this, swipeUpOverlay.get(this)))
        }
        debugWidget.get(this).toggle()
    }
}