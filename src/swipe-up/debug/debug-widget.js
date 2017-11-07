import {version, dependencies} from '../../../package.json'
import $ from '../utils/dom'
import KeyboardButton from './buttons/keyboard-button'
import RefreshButton from './buttons/refresh-button'
import FullScreenButton from './buttons/fullscreen-button'
import EmailButton from './buttons/email-button'
import DisableButton from './buttons/disable-button'
import HideButton from './buttons/hide-button'
import CloseMeButton from './buttons/close-me-button'

export default class DebugWidget {
    constructor(swipeUp, swipeUpOverlay, win = window) {
        this._swipeUp = swipeUp
        this._win = win
        this._browserUiState = swipeUp.browserUiState

        this._debugWidgetContainer = document.createElement('div')
        this._debugWidgetContainer.className = 'debugWidget'

        let closeMeButton = new CloseMeButton(this)

        $(this._debugWidgetContainer).append(
            '<div class="debugAllReadings"></div>'+
            '<div class="debugUserAgent"></div>' +
            '<div class="debugSwipeUpOptions"></div>' +
            '<div class="debugButtons"></div>')
        this._win.document.body.appendChild(this._debugWidgetContainer)

        this.update()

        closeMeButton.attachClickAfterButtonAddedToDom()

        new KeyboardButton(this)
        new RefreshButton(this)
        new FullScreenButton(this)
        new EmailButton(this)
        new DisableButton(this, swipeUp)
        new HideButton(this, swipeUp)
    }

    update() {
        if (this._debugWidgetContainer.style.display === 'none') return

        this._debugWidgetContainer.style.backgroundColor = this._swipeUp.isShown ? 'initial' : 'rgba(0, 0, 0, 0.5)'

        $('.debugAllReadings').html(this.recordAllReadings)
        $('.debugUserAgent').html(this.recordUserAgent)
        $('.debugSwipeUpOptions').html(this.recordSwipeUpOptions)
    }

    get recordAllReadings() {
        const ownVersion = version
        const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)
        const devicePixelRatio = +this._win.devicePixelRatio.toFixed(2)
        const screenDimensions = this._win.screen.width + 'x' + this._win.screen.height
        const windowDimensions = this._win.innerWidth + 'x' + this._win.innerHeight

        const screenType = this._win.screen.orientation && this._win.screen.orientation.type ?
            this._win.screen.orientation.type.replace(/(.).*-(.).*/, '$1$2') : '-'

        const orientation = this._browserUiState.orientation[0]
        const html5FullscreenIsAvailable = this._browserUiState.fscreen.fullscreenEnabled ? 'Y' : 'N'

        const html5FullscreenIsAvailable2 = document.fullscreenEnabled ?
            'Y' : typeof document.fullscreenEnabled !== 'undefined' ? 'N' : 'U'

        const html5FullscreenIsOn = !!this._browserUiState.fscreen.fullscreenElement ? 'Y' : 'N'

        const standalone = this._win.navigator.standalone ?
            'Y' : typeof this._win.navigator.standalone !== 'undefined' ? 'N' : 'U'

        const collapsedThreshold = `${this._browserUiState.collapsedThreshold}%`
        const deviation = `${this._browserUiState.deviation.toFixed(2)}%`
        const keyboardThreshold = `${this._browserUiState.keyboardThreshold}%`
        const state = this._browserUiState.state.toLowerCase()

        return `v${ownVersion} : ` +
            `v${browserUiStateVersion} : ` +
            `${devicePixelRatio} : ` +
            `${screenDimensions} : ` +
            `${windowDimensions} : ` +
            `{${screenType} : ` +
            `${orientation}} : ` +
            `[${html5FullscreenIsAvailable} ` +
            `(${html5FullscreenIsAvailable2}) : ` +
            `${html5FullscreenIsOn}] : ` +
            `${standalone} : ` +
            `${collapsedThreshold} : ` +
            `<b>${deviation}</b> : ` +
            `${keyboardThreshold} : ` +
            `<u><b>${state}</u></b><br>` +
            `${this._win.document.body.style.height} : ` +
            `${this._win.document.body.clientHeight} : ` +
            `${this._win.document.body.offsetHeight} : ` +
            `${this._win.document.body.scrollHeight} | ` +
            `${this._win.document.documentElement.style.height} : ` +
            `${this._win.document.documentElement.clientHeight} : ` +
            `${this._win.document.documentElement.offsetHeight} : ` +
            `${this._win.document.documentElement.scrollHeight} | ` +
            `${this._win.getComputedStyle(document.body).height} : ` +
            `${this._win.getComputedStyle(document.documentElement).height}<br>`
    }

    get recordUserAgent() {
        const userAgent = this._win.navigator.userAgent

        const userAgentName = this._browserUiState._userAgentDetector.userAgent ?
            this._browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'

        const deviceName = this._browserUiState._provider._device ?
            this._browserUiState._provider._device.toLowerCase() : '...'

        return `${userAgentName} : ${deviceName} : ${userAgent}`
    }

    get recordSwipeUpOptions() {
        let opts = this._swipeUp.appliedOptions
        return `${opts.initialOrientation} : ${opts.addImportantToBodyHeight} : ${opts.fixateRootElementsOnInit} : ` +
            `${opts.scrollWindowToTopOnShow} : ${opts.useHtml5FullScreenWhenPossible} : ${opts.excludedUserAgents} : ` +
            `<i>${opts.customCSS}</i> : ${opts.customCSSCleanSlate} : ${opts.expandBodyHeightTo} : ` +
            `${opts.updateTimeout} : <i>${opts.swipeUpContent}</i> : <i>${opts.html5FullScreenContent}</i>`
    }

    show() {
        $(this._debugWidgetContainer).show()
        this._debugWidgetContainer.style.backgroundColor = this._swipeUp.isShown ? 'initial' : 'rgba(0, 0, 0, 0.5)'
    }

    hide() { $(this._debugWidgetContainer).hide() }

    toggle() {
        $(this._debugWidgetContainer).toggle()
        this._debugWidgetContainer.style.backgroundColor = this._swipeUp.isShown ? 'initial' : 'rgba(0, 0, 0, 0.5)'
    }
}