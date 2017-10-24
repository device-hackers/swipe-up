import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug/debug-widget'
import DebugWidgetTrigger from './debug/debug-widget-trigger'
import EventThrottle from '../utils/event-throttle'

//Private scope
const swipeUpText = 'Swipe up to continue in full-screen mode'
const html5FullScreenText = 'Touch to continue in full-screen mode'
const localStorageDisableKey = 'SwipeUp._disabled'

let win = new WeakMap()
let swipeUpOverlay = new WeakMap()
let swipeUpOverlayParent = new WeakMap()
let swipeUpOverlaySubParent = new WeakMap()
let debugWidget = new WeakMap()

let showOrHide = (self) => {
    let disabled = (win.get(self).localStorage.getItem(localStorageDisableKey) === 'true')

    if (!disabled && self.browserUiState.state === 'COLLAPSED') {
        //win.get(self).document.body.style.height = '100vh'
        swipeUpOverlay.get(self).style.display = 'block'
    } else if (swipeUpOverlay.get(self).style.display !== 'none') {
        //win.get(self).innerHeight === 696 ?
            //win.get(self).document.body.style.height = win.get(self).innerHeight + 'px' //: null
        swipeUpOverlay.get(self).style.display = 'none'
    }
}

export default class SwipeUp {
    constructor(initialOrientation = null, windowObj = window) {
        if (!windowObj.document.body) {
            throw new Error('Swipe Up should be instantiated on window load when DOM is ready')
        }
        win.set(this, windowObj)
        swipeUpOverlayParent.set(this, win.get(this).document.createElement('div'))
        swipeUpOverlayParent.get(this).className = 'swipeUpOverlayParent'

        swipeUpOverlaySubParent.set(this, win.get(this).document.createElement('div'))
        swipeUpOverlaySubParent.get(this).className = 'swipeUpOverlaySubParent'

        swipeUpOverlay.set(this, win.get(this).document.createElement('div'))
        swipeUpOverlay.get(this).className = 'swipeUpOverlay'
        swipeUpOverlay.get(this).innerHTML = swipeUpText

        //swipeUpOverlayParent.get(this).appendChild(swipeUpOverlay.get(this))
        //swipeUpOverlayParent.get(this).appendChild(swipeUpOverlay.get(this))

        win.get(this).document.body.appendChild(swipeUpOverlay.get(this))
        /*win.get(this).document.body.innerHTML += `<div id='app'>` +
            `<div id='viewport'>` +
                `<div id='overlays'>` +
                    `<div id='blockScreen' class='swipeUpOverlay'>` +
                        `<div tabindex='0'></div>` +
                        `<div class='lblBlockMessage'>Swipe up to play in full screen.</div>` +
                    `</div>` +
                `</div>` +
            `</div>` +
        `</div>`*/

        //swipeUpOverlay.set(this, win.get(this).document.querySelector('#blockScreen'))
        let debugWidgetTrigger = new DebugWidgetTrigger(this, swipeUpOverlay.get(this), win.get(this))

        //expose browser-ui-state and fscreen as part of swipe-up API
        this.browserUiState = new BrowserUiState(initialOrientation, win.get(this))

        this.fscreen = this.browserUiState.fscreen


        debugWidgetTrigger.shouldShowWidgetOnLoad ? this.showDebugWidget() : null

        let scrollTimer, resizeTimer
        const scrollHandler = () => {
            clearTimeout(scrollTimer)
            scrollTimer = setTimeout( () => {
                showOrHide(this)
                debugWidget.get(this) ? debugWidget.get(this).update() : null
            }, 250)
        }

        const resizeHandler = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout( () => {
                showOrHide(this)
                debugWidget.get(this) ? debugWidget.get(this).update() : null
            }, 250)
        }

        new EventThrottle('resize', 'optimizedResize', win.get(this))
        new EventThrottle('scroll', 'optimizedScroll', win.get(this))
        win.get(this).addEventListener('optimizedResize', resizeHandler)
        win.get(this).addEventListener('orientationchange', resizeHandler)
        win.get(this).addEventListener('optimizedScroll', scrollHandler)
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