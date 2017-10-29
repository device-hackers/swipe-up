import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug/debug-widget'
import DebugWidgetTrigger from './debug/debug-widget-trigger'
import EventThrottle from '../utils/event-throttle'
import $ from '../utils/dom'

//Private scope
const swipeUpText = 'Swipe up to continue in full-screen mode'
const html5FullScreenText = 'Touch to continue in full-screen mode'
const localStorageDisableKey = 'SwipeUp._disabled'
const expandBodyHeightTo = '110vh'

//win is a shortcut for window
let _win = new WeakMap(), _options = new WeakMap(), _swipeUpOverlay = new WeakMap(), _debugWidget = new WeakMap()

//TODO add styles overrides, add switch to override or init styles
//TODO replace words with pictures for swipe up and html5 full screen
const defaultOptions = {
    initialOrientation: null,
    bodyBehavior: null, //['fixateRootElementsOnInit'|'scrollWindowToTopOnShow']
    useHtml5FullScreenWhenPossible: true, //bodyBehavior has no meaning for user-agents capable of HTML5 Fullscreen API
    excludedUserAgents: null,
}

let showOrHide = (self) => {
    let disabledInDebugging = (_win.get(self).localStorage.getItem(localStorageDisableKey) === 'true')
    let win = _win.get(self), options = _options.get(self), swipeUpOverlay = _swipeUpOverlay.get(self)

    if (!disabledInDebugging && self.isEnabled && self.browserUiState.state === 'COLLAPSED') {
        $(swipeUpOverlay).show()
        options.bodyBehavior === 'scrollWindowToTopOnShow' ? win.scrollTo(0, 0) : null
    } else if (swipeUpOverlay.style.display !== 'none') {
        $(swipeUpOverlay).hide()
    }
}

//TODO findout when and why CP got position:absolute override for #app
let fixateRootElementsIfNeeded = (self) => {
    if (_options.get(self).bodyBehavior === 'fixateRootElementsOnInit') {
        Array.from(_win.get(self).document.body.children).forEach((el) => el.style.position = 'fixed')
    }
}

export default class SwipeUp {
    constructor(opts, windowObj = window) {
        if (!windowObj.document.body) {
            throw new Error('Swipe Up should be instantiated on window load when DOM is ready')
        }
        _win.set(this, windowObj)
        _options.set(this, Object.assign(defaultOptions, opts))
        let win = _win.get(this)
        let options = _options.get(this)

        //expose browser-ui-state and fscreen as part of swipe-up API
        this.browserUiState = new BrowserUiState(options.initialOrientation, win)
        this.fscreen = this.browserUiState.fscreen


        //Proceed to init DOM if not forbidden by excludedUserAgents option
        if (!this.isUserAgentExcluded) {
            let useHtml5FullScreen = options.useHtml5FullScreenWhenPossible && this.fscreen.fullscreenEnabled
            if (!useHtml5FullScreen) {
                fixateRootElementsIfNeeded(this)
                win.document.body.style.height = expandBodyHeightTo //Required for Safari portrait
            }

            _swipeUpOverlay.set(this, win.document.createElement('div'))
            let swipeUpOverlay = _swipeUpOverlay.get(this)
            swipeUpOverlay.className = 'swipeUpOverlay'
            swipeUpOverlay.innerHTML =
                `<div class='fixedFlexBox'>` +
                    `<div class='content'>${useHtml5FullScreen ? html5FullScreenText : swipeUpText}</div>` +
                `</div>`
            win.document.body.appendChild(swipeUpOverlay)

            if (useHtml5FullScreen) {
                $('.fixedFlexBox').get().addEventListener('click',
                    () => this.fscreen.requestFullscreen(win.document.documentElement))
            }

            let debugWidgetTrigger = new DebugWidgetTrigger(this, swipeUpOverlay, win)
            debugWidgetTrigger.shouldShowWidgetOnLoad ? this.showDebugWidget() : null

            const resizeHandler = (event) => {
                showOrHide(this)
                _debugWidget.get(this) ? _debugWidget.get(this).update() : null
            }

            new EventThrottle('resize', 'optimizedResize', win)
            new EventThrottle('orientationchange', 'optimizedOrientationchange', win)
            win.addEventListener('optimizedResize', resizeHandler)
            win.addEventListener('optimizedOrientationchange', resizeHandler)
        }
    }

    get isShown() {
        return _swipeUpOverlay.get(this).style.display === 'block'
    }

    get isUserAgentExcluded() {
        return _options.get(this).excludedUserAgents &&
               _options.get(this).excludedUserAgents instanceof RegExp &&
               _options.get(this).excludedUserAgents.test(_win.get(this).navigator.userAgent)
    }

    disable() {
        this.isEnabled = false
        $(_swipeUpOverlay.get(this)).hide()
    }

    enable() {
        this.isEnabled = true
        _win.get(this).localStorage.setItem(localStorageDisableKey, 'false')
        !this.isUserAgentExcluded ? showOrHide(this) : null
    }

    showDebugWidget() {
        if (!_debugWidget.get(this)) {
            _debugWidget.set(this, new DebugWidget(this, _swipeUpOverlay.get(this)))
        }
        _debugWidget.get(this).show()
    }

    hideDebugWidget() {
        if (!_debugWidget.get(this)) {
            _debugWidget.set(this, new DebugWidget(this, _swipeUpOverlay.get(this)))
        }
        _debugWidget.get(this).hide()
    }

    toggleDebugWidget() {
        if (!_debugWidget.get(this)) {
            _debugWidget.set(this, new DebugWidget(this, _swipeUpOverlay.get(this)))
        }
        _debugWidget.get(this).toggle()
    }
}