import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug-widget'

class SwipeUp {
    constructor(initialOrientation = null, win = window) {
        this._win = win
        this.browserUiState = new BrowserUiState(initialOrientation, this._win)

        this._win.addEventListener('load', () => {
            this._swipeUpOverlay = document.createElement('div')
            this._swipeUpOverlay.className = 'swipeUpOverlay'
            this._swipeUpOverlay.innerHTML = 'Swipe up to continue in full-screen mode'
            this._win.document.body.appendChild(this._swipeUpOverlay)

            this._showOrHide()
        })

        const resizeHandler = () => {
            this._showOrHide()
            this._debugWidgetContainer.update()
        }

        //TODO add request animation frame, see https://developer.mozilla.org/en-US/docs/Web/Events/resize
        this._win.addEventListener('resize', resizeHandler)
        this._win.addEventListener('orientationchange', resizeHandler)
        //TODO add scroll handler
    }

    _showOrHide() {
        let disabled = (this._win.localStorage.getItem('SwipeUp._disabled') === 'true')

        if (!disabled && this.browserUiState.state === 'COLLAPSED') {
            this._swipeUpOverlay.style.display = 'block'
        } else if (this._swipeUpOverlay.style.display !== 'none') {
            this._swipeUpOverlay.style.display = 'none'
        }
    }

    disable() {
        this._win.localStorage.setItem('SwipeUp._disabled', 'true')
        this._showOrHide()
    }

    enable() {
        this._win.localStorage.setItem('SwipeUp._disabled', 'false')
        this._showOrHide()
    }

    showDebugWidget() {
        if (!this._debugWidgetContainer) {
            this._debugWidgetContainer = new DebugWidget(this)
        }
        this._debugWidgetContainer.show()
    }

    hideDebugWidget() {
        if (!this._debugWidgetContainer) {
            this._debugWidgetContainer = new DebugWidget(this)
        }
        this._debugWidgetContainer.hide()
    }

    toggleDebugWidget() {
        if (!this._debugWidgetContainer) {
            this._debugWidgetContainer = new DebugWidget(this)
        }
        this._debugWidgetContainer.toggle()
    }
}

export default SwipeUp