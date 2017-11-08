import BrowserUiState from 'browser-ui-state'
import DebugWidget from './debug/debug-widget'
import DebugWidgetTrigger from './debug/debug-widget-trigger'
import EventThrottle from './utils/event-throttle'
import SwipeUpCss from './css/swipe-up.css'
import DebugWidgetCss from './css/debug-widget.css'
import $, {
    addRunTimeStyles, inIframe, isUrlTriggerParamPresent, overrideBoolean, overrideNumber, overrideString
} from './utils/dom'
import defaultOptions, {overrideOptions} from './options'
import es6_weak_map_polyfill from 'es6-weak-map/implement'
import es6_object_assign_polyfill from 'es6-object-assign/auto'
import Detection from "./utils/detection"

//Private scope
const localStorageDisableKey = 'SwipeUp._disabled' //Used for debugging purposes to allow disabling swipe up
const swipeUpOff = 'swipeUpOff' //To disable Swipe Up via URL

//win is a shortcut for window
let _win = new WeakMap(), _options = new WeakMap(), _swipeUpOverlay = new WeakMap(), _debugWidget = new WeakMap()

/**
 * Swipe Up "core" method. Uses Browser UI State to determine at given moment if swipe up overlay
 * should be shown to the user. Displays overlay only when state is "COLLAPSED", hides otherwise.
 * @param self - reference to this
 */
const showOrHide = (self) => {
    let disabledInDebugging = (_win.get(self).localStorage.getItem(localStorageDisableKey) === 'true')
    let win = _win.get(self), options = _options.get(self), swipeUpOverlay = _swipeUpOverlay.get(self)

    if (!disabledInDebugging && self.isEnabled && self.browserUiState.state === 'COLLAPSED') {
        $(swipeUpOverlay).show()
        options.scrollWindowToTopOnShow ? win.scrollTo(0, 0) : null
    } else if (swipeUpOverlay.style.display !== 'none') {
        $(swipeUpOverlay).hide()
    }
}

/**
 * Needed as a requirement for some SPAs like full-screen games, where scrolling of the whole game
 * together with swipe up overlay would be unacceptable (in default case when swipe up overlay is
 * half-transparent and so the web app is visible to the user)
 * @param self - reference to this
 */
const fixateRootElementsIfNeeded = (self) => {
    if (_options.get(self).fixateRootElementsOnInit) {
        let rootElements = _win.get(self).document.body.children
        //Because Array.from doesn't supported in Android Stock Browsers
        for (let i = 0; i < document.body.children.length; i++) {
            document.body.children[i].style.position = 'fixed'
        }
    }
}

/**
 * Method used by Swipe Up to determine if it should be launched
 * @param self - reference to this
 * @returns {boolean} true if either user-agent excluded or swipeUpOff in URL or
 * Swipe Up resides in the documented which is not top frame, false otherwise
 */
const isForbidden = (self) => {
    return self.isUserAgentExcluded ||
    isUrlTriggerParamPresent(swipeUpOff, _win.get(self)) ||
    inIframe()
}

/**
 * As can be seen in default options - Swipe Up will try to use HTML5 FullScreen API if user-agent
 * supports it, falling back to regular "swipe up" overlay otherwise. This, as well as any other options,
 * can be turned-off at design or run-time (using URL param with the same name)
 * TODO UC EN 11.4.8 on S7 Edge reports that it supports HTML5 FullScreen API and it actually does,
 * but once switched to it - it locks itself to landscape, so need wrap fscreen with blacklisting
 */
export default class SwipeUp {
    constructor(customOptions, windowObj = window) {
        if (!windowObj.document.body) {
            throw new Error('Swipe Up should be instantiated on window load when DOM is ready')
        }
        _win.set(this, windowObj)
        let win = _win.get(this)
        _options.set(this, overrideOptions(defaultOptions, customOptions, win))
        let options = _options.get(this)

        //expose browser-ui-state and fscreen as part of swipe-up API
        this.browserUiState = new BrowserUiState(options.initialOrientation, win)
        this.fscreen = this.browserUiState.fscreen


        //Proceed to init DOM if not forbidden
        if (!isForbidden(this)) {
            let customCSS = options.customCSS
            let customCSSCleanSlate = options.customCSSCleanSlate
            let cssToApply = customCSSCleanSlate ? customCSS : SwipeUpCss + customCSS

            addRunTimeStyles(cssToApply + DebugWidgetCss, win)

            //TODO refactor below
            let userAgent = win.navigator.userAgent
            let isLGG3 = /(?:LG.(?:D855|D850|D851|D852))/i.test(userAgent)
            let isUcBrowser = /\WUCBrowser/i.test(userAgent)

            let useHtml5FullScreen = options.useHtml5FullScreenWhenPossible &&
                                    this.fscreen.fullscreenEnabled &&
                                    !isLGG3 && !isUcBrowser

            if (!useHtml5FullScreen) {
                fixateRootElementsIfNeeded(this)

                //TODO rework this. This is for Android Stock browsers which doesn't support vh units
                Detection.isUserAgentNotFiringResize(win.navigator.userAgent) ?
                    options.expandBodyHeightTo = '150%' : null

                //Required for Safari portrait
                options.addImportantToBodyHeight ?
                    win.document.body.style.setProperty('height', options.expandBodyHeightTo, 'important') :
                    win.document.body.style.setProperty('height', options.expandBodyHeightTo)
            }

            let html5FullScreenContent = options.html5FullScreenContent
            let swipeUpContent = options.swipeUpContent

            _swipeUpOverlay.set(this, win.document.createElement('div'))
            let swipeUpOverlay = _swipeUpOverlay.get(this)
            swipeUpOverlay.className = 'swipeUpOverlay'
            swipeUpOverlay.innerHTML =
                `<div class='fixedFlexBox'>
                    <div class='content'>${(useHtml5FullScreen ? html5FullScreenContent : swipeUpContent)}</div>
                </div>`
            win.document.body.appendChild(swipeUpOverlay)

            if (useHtml5FullScreen) {
                let htmlElement = win.document.documentElement
                let fixedFlexBox = $('.fixedFlexBox').get()
                fixedFlexBox.addEventListener('click', () => this.fscreen.requestFullscreen(htmlElement))
                fixedFlexBox.addEventListener('touchmove', (event) => event.preventDefault())
            }

            let debugWidgetTrigger = new DebugWidgetTrigger(this, swipeUpOverlay, win)
            debugWidgetTrigger.shouldShowWidgetOnLoad ? this.showDebugWidget() : null

            const resizeHandler = () => {
                setTimeout(() => {
                    showOrHide(this)
                    _debugWidget.get(this) ? _debugWidget.get(this).update() : null
                }, options.updateTimeout)
            }

            new EventThrottle('resize', 'optimizedResize', win)
            new EventThrottle('orientationchange', 'optimizedOrientationchange', win)
            win.addEventListener('optimizedResize', resizeHandler)
            win.addEventListener('optimizedOrientationchange', resizeHandler)

            if (Detection.isUserAgentNotFiringResize(win.navigator.userAgent)) {
                options.scrollWindowToTopOnShow = false //see explanation in options.js
                new EventThrottle('scroll', 'optimizedScroll', win)
                win.addEventListener('optimizedScroll', resizeHandler)
            }
        }
    }

    get isShown() {
        return _swipeUpOverlay.get(this).style.display === 'block'
    }

    get isUserAgentExcluded() {
        let userAgent = _win.get(this).navigator.userAgent
        let excludedUserAgents = _options.get(this).excludedUserAgents
        return (excludedUserAgents instanceof RegExp && excludedUserAgents.test(userAgent))
                ||
               (excludedUserAgents instanceof Function && excludedUserAgents())
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

    get appliedOptions() {
        return _options.get(this)
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