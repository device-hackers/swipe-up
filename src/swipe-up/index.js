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

let showOrHide = (self) => {
    let disabled = (win.get(self).localStorage.getItem(localStorageDisableKey) === 'true')

    if (!disabled && self.browserUiState.state === 'COLLAPSED') {
        $(swipeUpOverlay.get(self)).show()
    } else if (swipeUpOverlay.get(self).style.display !== 'none' &&
                self.browserUiState.state === 'EXPANDED') {
        win.get(self).document.body.style.height = `${getScreenHeight(self)}px`//TODO add this to all cases
        $(swipeUpOverlay.get(self)).hide()
    }
}

let getScreenHeight = (self) => self.browserUiState.orientation === 'PORTRAIT' ?
    Math.max(win.get(self).screen.width, win.get(self).screen.height) :
    Math.min(win.get(self).screen.width, win.get(self).screen.height)

export default class SwipeUp {
    constructor(initialOrientation = null, windowObj = window) {
        if (!windowObj.document.body) {
            throw new Error('Swipe Up should be instantiated on window load when DOM is ready')
        }
        win.set(this, windowObj)

        swipeUpOverlay.set(this, win.get(this).document.createElement('div'))
        swipeUpOverlay.get(this).className = 'swipeUpOverlay'
        swipeUpOverlay.get(this).innerHTML = swipeUpText

        win.get(this).document.body.appendChild(swipeUpOverlay.get(this))

        let debugWidgetTrigger = new DebugWidgetTrigger(this, swipeUpOverlay.get(this), win.get(this))

        //expose browser-ui-state and fscreen as part of swipe-up API
        this.browserUiState = new BrowserUiState(initialOrientation, win.get(this))
        this.fscreen = this.browserUiState.fscreen

        debugWidgetTrigger.shouldShowWidgetOnLoad ? this.showDebugWidget() : null

        const resizeHandler = () => {
            showOrHide(this)
            debugWidget.get(this) ? debugWidget.get(this).update() : null
        }

        new EventThrottle('resize', 'optimizedResize', win.get(this))
        new EventThrottle('scroll', 'optimizedScroll', win.get(this))
        win.get(this).addEventListener('optimizedResize', resizeHandler)
        win.get(this).addEventListener('orientationchange', resizeHandler)
        win.get(this).addEventListener('optimizedScroll', resizeHandler)
    }

    get isShown() {
        return swipeUpOverlay.get(this).style.display === 'block'
    }

    disable() {
        win.get(this).localStorage.setItem(localStorageDisableKey, 'true')
        showOrHide(this)
    }

    enable() {
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