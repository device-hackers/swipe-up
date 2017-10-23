import {version, dependencies} from '../../package.json'
import SwipeUp from '../swipe-up/index'

class EventThrottle {
    constructor(type, name, win, obj) {
        obj = obj || win
        let running = false

        let dispatchFunction = () => {
            obj.dispatchEvent(new CustomEvent(name))
            running = false
        }

        let wrapperFunction = () => {
            if (running) return
            running = true
            if (win.requestAnimationFrame) {
                win.requestAnimationFrame(dispatchFunction)
            } else {
                setTimeout(dispatchFunction, 66)
            }
        }

        obj.addEventListener(type, wrapperFunction)
    }
}

class SwipeUpDemo {
    constructor() {
        let initialOrientation = window.innerWidth > window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT'

        window.addEventListener('load', () => {
            this.swipeUp = new SwipeUp(initialOrientation, window)
            //this.swipeUp.showDebugWidget() //its probably good idea to start without widget visible
            this.updateUi()

            document.getElementById('toggleViewport').addEventListener('click', event => this.toggleViewport())
            document.getElementById('toggleDebugWidget').addEventListener('click', event => this.toggleDebugWidget())
        })

        const resizeHandler = () => {
            this.updateUi()
        }

        new EventThrottle('resize', 'optimizedResize', window)
        window.addEventListener('optimizedResize', resizeHandler)
        window.addEventListener('orientationchange', resizeHandler)
    }

    updateUi() {
        const write = this.write
        const userAgent = window.navigator.userAgent

        const userAgentName = this.swipeUp.browserUiState._userAgentDetector.userAgent ?
            this.swipeUp.browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'

        const deviceName = this.swipeUp.browserUiState._provider._device ?
            this.swipeUp.browserUiState._provider._device.toLowerCase() : '...'

        write('ver', version)
        write('userAgent', userAgent)
        write('userAgentName', userAgentName)
        write('deviceName', deviceName)
    }

    write(elementId, text) {
        document.getElementById(elementId).innerHTML = text
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
        document.getElementById('meta-viewport').setAttribute('content', `user-scalable=no, ` +
            `initial-scale=${scaleFactor}, minimum-scale=${scaleFactor}, maximum-scale=${scaleFactor}`)
    }

    setViewportModern() {
        document.getElementById('meta-viewport').setAttribute('content', `user-scalable=no, ` +
            `width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0`)
    }

    toggleDebugWidget() {
        this.swipeUp.toggleDebugWidget()
    }
}

export default new SwipeUpDemo()