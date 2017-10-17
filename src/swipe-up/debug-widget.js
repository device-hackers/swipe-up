import {version, dependencies} from '../../package.json'

class DebugWidget {
    constructor(browserUiState, win = window) {
        this._win = win
        this._browserUiState = browserUiState

        this._widgetContainer = document.createElement('div')
        this._widgetContainer.className = 'debugWidget'
        this.update()
        this._win.document.body.appendChild(this._widgetContainer)
    }

    update() {
        const ownVersion = version
        const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)
        const dpr = +this._win.devicePixelRatio.toFixed(2)
        const sWH = this._win.screen.width + 'x' + this._win.screen.height
        const wWH = this._win.innerWidth + 'x' + this._win.innerHeight
        const screenType = this._win.screen.orientation ? this._win.screen.orientation.type.replace(/(.).*-(.).*/, '$1$2') : '-'
        const orientation = this._browserUiState.orientation[0]
        const html5FullscreenIsAvailable = this._browserUiState.fscreen.fullscreenEnabled ? 'Y' : 'N'
        const html5FullscreenIsAvailable2 = document.fullscreenEnabled ? 'Y' : typeof document.fullscreenEnabled != 'undefined' ? 'N' : 'U'
        const html5FullscreenIsOn = !!this._browserUiState.fscreen.fullscreenElement ? 'Y' : 'N'
        const standalone = this._win.navigator.standalone ? 'Y' : typeof this._win.navigator.standalone != 'undefined' ? 'N' : 'U'
        const collapsedThreshold = `${this._browserUiState.collapsedThreshold}%`
        const deviation = `${this._browserUiState.deviation.toFixed(2)}%`
        const keyboardThreshold = `${this._browserUiState.keyboardThreshold}%`
        const state = this._browserUiState.state.toLowerCase()
        const userAgent = this._win.navigator.userAgent
        const userAgentName = this._browserUiState._userAgentDetector.userAgent ? this._browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'
        const deviceName = this._browserUiState._provider._device ? this._browserUiState._provider._device.toLowerCase() : '...'
        //document.getElementById('html5FullscreenBtn').disabled = !this._browserUiState.fscreen.fullscreenEnabled

        this._widgetContainer.innerHTML = `v${ownVersion} : v${browserUiStateVersion} : ${dpr} : ${sWH} : ${wWH} : ` +
            `{${screenType} : ${orientation}} : [${html5FullscreenIsAvailable} (${html5FullscreenIsAvailable2}) : ` +
            `${html5FullscreenIsOn}] : ${standalone} : ${collapsedThreshold} : <b>${deviation}</b> : ${keyboardThreshold} : ` +
            `${state}<div style="font-size: 10px">${userAgentName} : ${deviceName} : ${userAgent}</div>`
    }

    show() {
        this._widgetContainer.style.display = 'block'
    }

    hide() {
        this._widgetContainer.style.display = 'none'
    }

    toggle() {
        this._widgetContainer.style.display === 'block' ?
            this._widgetContainer.style.display = 'none' :
            this._widgetContainer.style.display = 'block'
    }
}

export default DebugWidget