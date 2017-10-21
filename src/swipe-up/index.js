import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug/debug-widget'
import $ from '../util/dom'

//Private scope
let win = new WeakMap()
let swipeUpOverlay = new WeakMap()
let debugWidget = new WeakMap()

export default class SwipeUp {
    constructor(initialOrientation = null, windowObj = window) {
        win.set(this, windowObj)
        swipeUpOverlay.set(this, win.get(this).document.createElement('div'))

        //expose browser-ui-state as part of swipe-up API
        this.browserUiState = new BrowserUiState(initialOrientation, win.get(this))

        win.get(this).addEventListener('load', () => {
            swipeUpOverlay.get(this).className = 'swipeUpOverlay'
            $(swipeUpOverlay.get(this)).html('Swipe up to continue in full-screen mode')
            win.get(this).document.body.appendChild(swipeUpOverlay.get(this))

            this._showOrHide()
        })

        const resizeHandler = () => {
            this._showOrHide()
            debugWidget.get(this).update()
        }

        //TODO add request animation frame, see https://developer.mozilla.org/en-US/docs/Web/Events/resize
        //TODO add scroll handler
        win.get(this).addEventListener('resize', resizeHandler)
        win.get(this).addEventListener('orientationchange', resizeHandler)
    }

    _showOrHide() {
        let disabled = (win.get(this).localStorage.getItem('SwipeUp._disabled') === 'true')

        if (!disabled && this.browserUiState.state === 'COLLAPSED') {
            swipeUpOverlay.get(this).style.display = 'block'
        } else if (swipeUpOverlay.get(this).style.display !== 'none') {
            swipeUpOverlay.get(this).style.display = 'none'
        }
    }

    get isShown() {
        return swipeUpOverlay.get(this).style.display === 'block'
    }

    disable() {
        win.get(this).localStorage.setItem('SwipeUp._disabled', 'true')
        this._showOrHide()
    }

    enable() {
        win.get(this).localStorage.setItem('SwipeUp._disabled', 'false')
        this._showOrHide()
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