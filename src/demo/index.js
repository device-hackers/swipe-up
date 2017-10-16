import BrowserUiState from 'browser-ui-state'
import {version, dependencies} from '../../package.json'
import SwipeUp from "../swipe-up/index";

class BrowserUiStateDemo {
    constructor() {
        let initialOrientation = window.innerWidth > window.innerHeight ?
            'LANDSCAPE' : 'PORTRAIT'

        this.browserUiState = new BrowserUiState(initialOrientation, window)
        this.swipeUp = new SwipeUp()

        window.addEventListener('load', () => {
            this.updateUi()

            document.getElementById('html5FullscreenBtn').addEventListener('click', event => this.browserUiState.fscreen.fullscreenElement ?
                this.browserUiState.fscreen.exitFullscreen() : this.browserUiState.fscreen.requestFullscreen(document.documentElement))

            document.getElementById('refresh').addEventListener('click', event => this.updateUi())
            document.getElementById('toggleViewport').addEventListener('click', event => this.toggleViewport())
        })

        const resizeHandler = () => {
            this.updateUi()
            this.safeRun(this.updateUi.bind(this))
        }

        window.addEventListener('resize', resizeHandler)
        window.addEventListener('orientationchange', resizeHandler)
    }

    safeRun(func) {
        setTimeout(func, 300)
    }

    write(elementId, text) {
        document.getElementById(elementId).innerHTML = text
    }

    write2(elementClassName, text) {
        document.getElementsByClassName(elementClassName)[0].innerHTML = text
    }

    updateUi() {
        const write = this.write
        const write2 = this.write2
        const ownVersion = version
        const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)
        const dpr = +window.devicePixelRatio.toFixed(2)
        const sWH = screen.width + 'x' + screen.height
        const wWH = window.innerWidth + 'x' + window.innerHeight
        const screenType = screen.orientation ? screen.orientation.type.replace(/(.).*-(.).*/, '$1$2') : '-'
        const orientation = this.browserUiState.orientation[0]
        const html5FullscreenIsAvailable = this.browserUiState.fscreen.fullscreenEnabled ? 'Y' : 'N'
        const html5FullscreenIsAvailable2 = document.fullscreenEnabled ? 'Y' : typeof document.fullscreenEnabled != 'undefined' ? 'N' : 'U'
        const html5FullscreenIsOn = !!this.browserUiState.fscreen.fullscreenElement ? 'Y' : 'N'
        const standalone = window.navigator.standalone ? 'Y' : typeof window.navigator.standalone != 'undefined' ? 'N' : 'U'
        const collapsedThreshold = `${this.browserUiState.collapsedThreshold}%`
        const deviation = `${this.browserUiState.deviation.toFixed(2)}%`
        const keyboardThreshold = `${this.browserUiState.keyboardThreshold}%`
        const state = this.browserUiState.state.toLowerCase()
        const userAgent = window.navigator.userAgent
        const userAgentName = this.browserUiState._userAgentDetector.userAgent ? this.browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'
        const deviceName = this.browserUiState._provider._device ? this.browserUiState._provider._device.toLowerCase() : '...'
        document.getElementById('html5FullscreenBtn').disabled = !this.browserUiState.fscreen.fullscreenEnabled

        write('ver', version)
        write2('debugWidget', `v${ownVersion} : v${browserUiStateVersion} : ${dpr} : ${sWH} : ${wWH} : ` +
            `{${screenType} : ${orientation}} : [${html5FullscreenIsAvailable} (${html5FullscreenIsAvailable2}) : ` +
            `${html5FullscreenIsOn}] : ${standalone} : ${collapsedThreshold} : <b>${deviation}</b> : ${keyboardThreshold} : ` +
            `${state}<div style="font-size: 10px">${userAgentName} : ${deviceName} : ${userAgent}</div>`)
        write('userAgent', userAgent)
        write('userAgentName', userAgentName)
        write('deviceName', deviceName)

        //buttons: [keyboard] [refresh] [fullscreen] [lock] [disable] [email]
    }

    toggleViewport() {
        if (!ScalingReport.scaleFactor()) {
            ViewportManager.init() //init if not initialized
        }

        let viewport = document.getElementById('meta-viewport')

        if (viewport.dataset.viewportType === 'modern') {
            this.setViewportLegacy(ScalingReport.scaleFactor())
            viewport.dataset.viewportType = 'legacy'
        } else {
            this.setViewportModern()
            viewport.dataset.viewportType = 'modern'
        }
    }

    setViewportLegacy(scaleFactor) {
        document.getElementById('meta-viewport').setAttribute('content', `user-scalable=no, initial-scale=${scaleFactor}, ` +
            `minimum-scale=${scaleFactor}, maximum-scale=${scaleFactor}`)
    }

    setViewportModern() {
        document.getElementById('meta-viewport').setAttribute('content', `user-scalable=no, width=device-width, ` +
            `initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0`)
    }
}

export default new BrowserUiStateDemo()