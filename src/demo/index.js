import {version, dependencies} from '../../package.json'
import SwipeUp from '../swipe-up/index'

class SwipeUpDemo {
    constructor() {
        window.addEventListener('load', () => {
            this.swipeUp = new SwipeUp({useHtml5FullScreenWhenPossible: false, scrollWindowToTopOnShow: true}, window)
            this.swipeUp.enable()
            //this.swipeUp.showDebugWidget() //its probably good idea to start without widget visible
            this.renderUi()

            document.querySelector('#toggleViewport').addEventListener('click', event => this.toggleViewport())
            document.querySelector('#toggleDebugWidget').addEventListener('click', event => this.toggleDebugWidget())
            document.querySelector('#toggleEnableDisable').addEventListener('click', event =>
                this.swipeUp.isEnabled ? this.swipeUp.disable() : this.swipeUp.enable())

            document.querySelector('#initialOrientation').addEventListener('click', event => {
                let initialOrientation = window.innerWidth > window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT'
                applyNewOptions({ initialOrientation })
            })
            document.querySelector('#fixateRootElementsOnInit').addEventListener('click', event => {
                applyNewOptions({ fixateRootElementsOnInit: true })
            })
            document.querySelector('#scrollWindowToTopOnShow').addEventListener('click', event => {
                applyNewOptions({ scrollWindowToTopOnShow: true })
            })
            document.querySelector('#useHtml5FullScreenWhenPossible').addEventListener('click', event => {
                applyNewOptions({ useHtml5FullScreenWhenPossible: false })
            })
            document.querySelector('#excludedUserAgents').addEventListener('click', event => {
                applyNewOptions({ excludedUserAgents: new RegExp('Nexus 5', 'i') })
            })
            document.querySelector('#useTextInsteadOfImages').addEventListener('click', event => {
                applyNewOptions({ useTextInsteadOfImages: true })
            })
            document.querySelector('#customTexts').addEventListener('click', event => {
                applyNewOptions({ swipeUpText: 'Bla-bla custom swipe up text',
                                  html5FullScreenText: 'Bla-bla custom HTML5 full screen text' })
            })
            document.querySelector('#customCSS').addEventListener('click', event => {
                applyNewOptions({ customCSS: '.fixedFlexBox { background-color: rgba(0, 0, 50, 0.7) }' })
            })
            document.querySelector('#customCSSCleanSlate').addEventListener('click', event => {
                applyNewOptions({ customCSS: '.fixedFlexBox { background-color: rgba(0, 0, 50, 0.7) }',
                                  customCSSCleanSlate: true })
            })
        })

        let disposeSwipeUp = () => {
            document.querySelector('#swipe-up-styles').remove()
            document.querySelector('.swipeUpOverlay').remove()
            document.querySelector('.debugWidget').remove()
            this.swipeUp = null
        }

        let applyNewOptions = (options) => {
            disposeSwipeUp()
            this.swipeUp = new SwipeUp(options, window)
            this.swipeUp.enable()
        }
    }

    renderUi() {
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