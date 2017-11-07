import {overrideBoolean, overrideNumber, overrideRegExp, overrideString} from './utils/dom'

/**
 * Set of default options which meant to be overridden by options provided to SwipeUp constructor.
 */
export default {
    /**
     * Some user-agents (QQ both EN & CN, UC EN before 11.4.6) doesn't support screen.orientation API, but their
     * initial orientation can be determined at web page parse/execute time by comparing window.innerWidth and height.
     * And if it will be supplied to Swipe Up / Browser UI State - they will do a better job in determining
     * orientation and state, especially in context of on-screen keyboard and split-screen mode.
     * @type {string}
     * @default null
     */
    initialOrientation: null,

    /**
     * Some Web apps use importants like: body {height:100% !important}, so this is to allow them to override above
     * by adding important rule as well.
     * @type {boolean}
     * @default false
     */
    addImportantToBodyHeight: false,

    /**
     * To apply position:fixed for all body's direct children, so that body doesn't move.
     * @type {boolean}
     * @default false
     */
    fixateRootElementsOnInit: false,

    /**
     * If set to true will make window scroll to top whenever Swipe Up is triggering its showing.
     * Warning! This param is incompatible with old Android Stock browsers who require to add extra scroll handlers
     * on Swipe Up, which will collide with this param's behavior. Thus this param will be forced to false in such browsers.
     * @type {boolean}
     * @default false
     */
    scrollWindowToTopOnShow: false,

    /**
     * If set to true will try to switch from regular 'swipe up to continue' to HTML5 FullScreen 'touch to continue' if
     * user-agent supports it.
     * fixateRootElementsOnInit has no sense for user-agents capable of HTML5 Fullscreen API.
     * @type {boolean}
     * @default true
     */
    useHtml5FullScreenWhenPossible: true,

    /**
     * Ability to black-list user agents via RegExp or Function which should return true or false
     * on which Swipe Up will not work (e.g. Tablets).
     * @type {RegExp|Function}
     * @default null
     */
    excludedUserAgents: null,

    /**
     * Ability to brand/customize Swipe Up at run-time with CSS stored in the string.
     * @type {string}
     * @default ''
     */
    customCSS: '',

    /**
     * customCSS is applied standalone instead of adding to/after SwipeUpCss.
     * @type {boolean}
     * @default false
     */
    customCSSCleanSlate: false,

    /**
     * Must have trick for SPAs with no scrollable content to make body height bigger to force correct URL bar hiding.
     * Required at least for Safari, otherwise URL bar will appear back again right after swiping up.
     * @type {string}
     * @default '110vh'
     */
    expandBodyHeightTo: '110vh',

    /**
     * Milliseconds delay after resize/orientationchange to make decision to show or hide Swipe Up.
     * Required at least for Safari, otherwise resize after keyboard hiding will have stale dimensions of window.
     * @type {number}
     * @default 100
     */
    updateTimeout: 100,

    swipeUpContent: 'Swipe up to continue in full-screen mode',
    html5FullScreenContent: 'Touch to continue in full-screen mode',
}

export const overrideOptions = (defaultOptions, customOptions, win) => {
    let mergedOptions = Object.assign(defaultOptions, customOptions)

    overrideString(mergedOptions, 'initialOrientation', win)
    overrideBoolean(mergedOptions, 'addImportantToBodyHeight', win)
    overrideBoolean(mergedOptions, 'fixateRootElementsOnInit', win)
    overrideBoolean(mergedOptions, 'scrollWindowToTopOnShow', win)
    overrideBoolean(mergedOptions, 'useHtml5FullScreenWhenPossible', win)
    overrideRegExp(mergedOptions, 'excludedUserAgents', win)
    overrideString(mergedOptions, 'customCSS', win)
    overrideBoolean(mergedOptions, 'customCSSCleanSlate', win)
    overrideString(mergedOptions, 'expandBodyHeightTo', win)
    overrideNumber(mergedOptions, 'updateTimeout', win)
    overrideString(mergedOptions, 'swipeUpContent', win)
    overrideString(mergedOptions, 'html5FullScreenContent', win)

    return mergedOptions
}