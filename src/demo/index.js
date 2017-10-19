import {version, dependencies} from '../../package.json'
import SwipeUp from "../swipe-up/index";

class SwipeUpDemo {
    constructor() {
        let initialOrientation = window.innerWidth > window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT'

        this.swipeUp = new SwipeUp(initialOrientation, window)

        window.addEventListener('load', () => {
            this.updateUi()
            this.swipeUp.showDebugWidget()

            document.getElementById('toggleViewport').addEventListener('click', event => this.toggleViewport())
            document.getElementById('toggleDebugWidget').addEventListener('click', event => this.toggleDebugWidget())
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

    updateUi() {
        const write = this.write
        const userAgent = window.navigator.userAgent
        const userAgentName = this.swipeUp.browserUiState._userAgentDetector.userAgent ? this.swipeUp.browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'
        const deviceName = this.swipeUp.browserUiState._provider._device ? this.swipeUp.browserUiState._provider._device.toLowerCase() : '...'

        write('ver', version)
        write('userAgent', userAgent)
        write('userAgentName', userAgentName)
        write('deviceName', deviceName)
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

    toggleDebugWidget() {
        this.swipeUp.toggleDebugWidget()
    }
}

export default new SwipeUpDemo()