import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug-widget'

class SwipeUp {
    constructor(initialOrientation = null, win = window) {
        this.browserUiState = new BrowserUiState(initialOrientation, win)

        win.addEventListener('load', () => {
            this._swipeUpOverlay = document.createElement('div')
            this._swipeUpOverlay.className = 'swipeUpOverlay'
            this._swipeUpOverlay.innerHTML = 'Swipe up to continue in full-screen mode'
            win.document.body.appendChild(this._swipeUpOverlay)

            if (this.browserUiState.state === 'COLLAPSED') {
                this._swipeUpOverlay.style.display = 'block'
            }
        })

        const resizeHandler = () => {
            if (this.browserUiState.state === 'COLLAPSED') {
                this._swipeUpOverlay.style.display = 'block'
            } else {
                this._swipeUpOverlay.style.display = 'none'
            }
        }

        //TODO add request animation frame, see https://developer.mozilla.org/en-US/docs/Web/Events/resize
        win.addEventListener('resize', resizeHandler)
        win.addEventListener('orientationchange', resizeHandler)
        //TODO add scroll handler
    }

    showDebugWidget() {
        if (!this._debugWidget) {
            this._debugWidget = new DebugWidget(this.browserUiState)
        }
        this._debugWidget.show()
    }

    hideDebugWidget() {
        if (!this._debugWidget) {
            this._debugWidget = new DebugWidget(this.browserUiState)
        }
        this._debugWidget.hide()
    }

    toggleDebugWidget() {
        if (!this._debugWidget) {
            this._debugWidget = new DebugWidget(this.browserUiState)
        }
        this._debugWidget.toggle()
    }
}

export default SwipeUp