import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug-widget'
import $ from '../util/dom'

class SwipeUp {
    constructor(initialOrientation = null, win = window) {
        this._win = win
        this.browserUiState = new BrowserUiState(initialOrientation, this._win)

        let quickTapDetected = 0
        let timerId = null
        let bottomRightTouched
        let topLeftTouched3Times

        let isTopLeftCornerTouched = (touch) => touch.clientX <= 100 && touch.clientY <= 100

        let isBottomRightCornerTouched = (touch) =>
            touch.clientX >= win.innerWidth - 100 && touch.clientY >= win.innerHeight - 100

        this._win.addEventListener('load', () => {
            this._swipeUpOverlay = document.createElement('div')
            this._swipeUpOverlay.className = 'swipeUpOverlay'
            $(this._swipeUpOverlay).html('Swipe up to continue in full-screen mode')
            this._win.document.body.appendChild(this._swipeUpOverlay)

            this._showOrHide()

            this._swipeUpOverlay.addEventListener('touchstart', process_touchstart.bind(this), false);

            function process_touchstart(event) {
                bottomRightTouched = topLeftTouched3Times = false

                switch (event.touches.length) {
                    case 1: handle_one_touch(event); break;
                    case 2: handle_two_touches(event, this); break;
                    default: console.warn('not 2 touches', event); break;
                }
            }

            function handle_one_touch(event) {
                //console.log('handle_one_touch: ', event)

                process_touch(event.touches[0]);
            }

            function handle_two_touches(event, swipeup) {
                console.log('handle_two_touches: ', event)

                for (let i=0; i < event.touches.length; i++) {
                    process_touch(event.touches[i]);
                }

                if (topLeftTouched3Times && bottomRightTouched) {
                    swipeup.showDebugWidget()
                }
            }

            function process_touch(touch) {
                if (isTopLeftCornerTouched(touch)) {
                    quickTapDetected++
                    console.log(`top left corner touched (${quickTapDetected}): `, touch)

                    if (timerId) clearTimeout(timerId)
                    timerId = setTimeout(() => quickTapDetected = 0, 250)

                    if (quickTapDetected >= 3) {
                        console.warn('3+ quick taps detected!', quickTapDetected)
                        topLeftTouched3Times = true
                    }
                } else if (isBottomRightCornerTouched(touch)) {
                    console.log('bottom right corner touched: ', touch)
                    bottomRightTouched = true
                } else {
                    console.log('other touched: ', touch)
                }
            }
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