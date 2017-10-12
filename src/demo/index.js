import BrowserUiState from 'browser-ui-state'
import {version} from '../../package.json'

class BrowserUiStateDemo {
    constructor() {
        let initialOrientation = window.innerWidth > window.innerHeight ?
            'LANDSCAPE' : 'PORTRAIT'

        this.browserUiState = new BrowserUiState(initialOrientation, window)

        window.addEventListener('load', () => {
            this.updateUi()

            /*document.getElementById('html5FullscreenBtn').addEventListener('click', event => fscreen.fullscreenElement ?
                fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement))*/

            document.getElementById('refresh').addEventListener('click', event => this.updateUi())
            document.getElementById('refresh2').addEventListener('click', event => this.updateUi())
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
        document.getElementById(elementId).innerText = text
    }

    updateUi() {
        const write = this.write
        const dpr = window.devicePixelRatio
        const sWH = screen.width + 'x' + screen.height
        const wWH = window.innerWidth + 'x' + window.innerHeight
        const screenAngle = screen.orientation ? screen.orientation.angle : '-'
        const screenType = screen.orientation ? screen.orientation.type : '-'
        //const html5FullscreenIsAvailable = `${fscreen.fullscreenEnabled} ( ${document.fullscreenEnabled} )`
        //const html5FullscreenIsOn = !!fscreen.fullscreenElement
        const orientation = this.browserUiState.orientation
        const screenAspectRatio = this.browserUiState.screenAspectRatio.toFixed(2)
        const viewportAspectRatio = this.browserUiState.viewportAspectRatio.toFixed(2)
        const delta = this.browserUiState.delta.toFixed(2)
        const deviation = `${this.browserUiState.deviation.toFixed(2)}%`
        const collapsedThreshold = this.browserUiState.collapsedThreshold ? `${this.browserUiState.collapsedThreshold}%` : 'null'
        const keyboardThreshold = this.browserUiState.keyboardThreshold ? `${this.browserUiState.keyboardThreshold}%` : 'null'
        const state = this.browserUiState.state
        //document.getElementById('html5FullscreenBtn').disabled = !fscreen.fullscreenEnabled

        write('ver', version)
        write('allReadings', `${dpr} / ${sWH} / ${wWH} / ${screenAngle} / ${screenType} / ` +
            `${html5FullscreenIsAvailable} / ${html5FullscreenIsOn} / ${deviation} / ${state}`)
        write('userAgent', window.navigator.userAgent)
        write('userAgentName', this.browserUiState._userAgentDetector.userAgent ? this.browserUiState._userAgentDetector.userAgent : '...')
        write('deviceName', this.browserUiState._provider._device ? this.browserUiState._provider._device : '...')
        write('dpr', dpr)
        write('sWH', sWH)
        write('wWH', wWH)
        write('screenAngle', screenAngle)
        write('screenType', screenType)
        //write('html5FullscreenIsAvailable', html5FullscreenIsAvailable)
        //write('html5FullscreenIsOn', html5FullscreenIsOn)

        write('orientation', orientation)
        write('screenAspectRatio', screenAspectRatio)
        write('viewportAspectRatio', viewportAspectRatio)
        write('delta', delta)
        write('deviation', deviation)
        write('collapsedThreshold', collapsedThreshold)
        write('keyboardThreshold', keyboardThreshold)
        write('state', state)
    }
}

export default new BrowserUiStateDemo()