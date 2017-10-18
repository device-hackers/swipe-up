import {version, dependencies} from '../../package.json'

class DebugWidget {
    constructor(swipeUp, win = window) {
        this._win = win
        this._browserUiState = swipeUp.browserUiState

        this._debugWidget = document.createElement('div')
        this._debugWidget.className = 'debugWidget'

        this._debugWidgetCloseBtn = document.createElement('button')
        this._debugWidgetCloseBtn.className = 'debugWidgetCloseBtn'
        this._debugWidgetCloseBtn.innerHTML = 'x'
        this._debugWidget.appendChild(this._debugWidgetCloseBtn)

        this._debugAllReadings = document.createElement('div')
        this._debugAllReadings.className = 'debugAllReadings'
        this._debugWidget.appendChild(this._debugAllReadings)

        this._debugUserAgent = document.createElement('div')
        this._debugUserAgent.className = 'debugUserAgent'
        this._debugWidget.appendChild(this._debugUserAgent)

        this._debugButtons = document.createElement('div')
        this._debugButtons.className = 'debugButtons'
        this._debugButtons.innerHTML =
            `<input class='inputForKeyboard' tabindex='0'>` +
            `<button class='keyboard'>keyboard</button>` +
            `<button class='refresh'>refresh</button>` +
            `<button class='fullscreen'>fullscreen</button>` +
            `<button class='lock'>lock</button>` +
            `<button class='email'>email</button>` +
            `<button class='disable'>disable</button>`

        this._debugWidget.appendChild(this._debugButtons)
        this.update()
        this._win.document.body.appendChild(this._debugWidget)

        let swipeUpDisabled = (this._win.localStorage.getItem('SwipeUp._disabled') === 'true')

        if (swipeUpDisabled) {
            this._win.document.getElementsByClassName('disable')[0].innerHTML = 'enable'
            this._win.document.getElementsByClassName('disable')[0].style.backgroundImage = 'url("assets/add.png")'
        }

        if (!this._browserUiState.fscreen.fullscreenEnabled) {
            this._win.document.getElementsByClassName('fullscreen')[0].classList.add('disabled')
        }

        if (!isModernLockScreenSupported(this._win) && !isLegacyLockScreenSupported(this._win)) {
            this._win.document.getElementsByClassName('lock')[0].classList.add('disabled')
        }

        //Click handlers:

        this._win.document.getElementsByClassName('debugWidgetCloseBtn')[0].addEventListener('click', event =>
            this.hide()
        )

        this._win.document.getElementsByClassName('keyboard')[0].addEventListener('click', event =>
            this._win.document.getElementsByClassName('inputForKeyboard')[0].focus()
        )

        this._win.document.getElementsByClassName('refresh')[0].addEventListener('click', event =>
            this.update()
        )

        this._win.document.getElementsByClassName('fullscreen')[0].addEventListener('click', event => {
            let self = this._win.document.getElementsByClassName('fullscreen')[0]

            if (this._browserUiState.fscreen.fullscreenElement) {
                this._browserUiState.fscreen.exitFullscreen()
                self.style.backgroundImage = 'url("assets/fullscreen-enter.png")'
            } else {
                this._browserUiState.fscreen.requestFullscreen(this._win.document.documentElement)
                self.style.backgroundImage = 'url("assets/fullscreen-exit.png")'
            }
        })

        this._win.document.getElementsByClassName('lock')[0].addEventListener('click', event => {
            let orientationToLockTo = this._browserUiState.orientation === 'LANDSCAPE' ? 'portrait' : 'landscape'
            let self = this._win.document.getElementsByClassName('lock')[0]

            if (isModernLockScreenSupported(this._win)) {
                lockModern(this._win, self, orientationToLockTo)
            } else {
                lockLegacy(this._win, self, orientationToLockTo)
            }
        })

        function isModernLockScreenSupported(win) {
            return win.screen.orientation && win.screen.orientation.lock
        }

        function isLegacyLockScreenSupported(win) {
            return win.screen.lockOrientation || win.screen.mozLockOrientation || win.screen.msLockOrientation
        }

        function lockModern(win, self, orientationToLockTo) {
            if (self.innerHTML === 'lock') {
                win.screen.orientation.lock(orientationToLockTo)
                    .then(() => setLocked(self))
                    .catch((err) => console.error('Orientation lock failed: ', err))
            } else {
                win.screen.orientation.unlock()
                setUnlocked(self)
            }
        }

        function lockLegacy(win, self, orientationToLockTo) {
            let lockOrientation = win.screen.lockOrientation || win.screen.mozLockOrientation || win.screen.msLockOrientation
            let unlockOrientation = win.screen.unlockOrientation || win.screen.mozUnlockOrientation || win.screen.msUnlockOrientation

            if (self.innerHTML === 'lock' && lockOrientation(orientationToLockTo)) {
                setLocked(self)
            } else {
                console.error('Orientation lock failed')
            }

            if (self.innerHTML === 'unlock' && unlockOrientation()) {
                setUnlocked(self)
            } else {
                console.error('Orientation unlock failed')
            }
        }

        function setLocked(self) {
            console.log('Orientation was locked')
            self.innerHTML = 'unlock'
            self.style.backgroundImage = 'url("assets/unlock.png")'
        }

        function setUnlocked(self) {
            console.log('Orientation was unlocked')
            self.innerHTML = 'lock'
            self.style.backgroundImage = 'url("assets/lock.png")'
        }

        this._win.document.getElementsByClassName('email')[0].addEventListener('click', event => {
            let promptText = prompt('Please enter your device and browser name', '')
            let deviceInfoToInclude = promptText
            let navigatorInfo = ''

            for (let prop in this._win.navigator) {
                if (!(this._win.navigator[prop] instanceof Function) &&
                    !(this._win.navigator[prop] instanceof Object)) {
                    navigatorInfo += `navigator.${prop} : ${this._win.navigator[prop]}\n`
                }
            }

            let generatedLink =
                `subject=[SwipeUp] ${deviceInfoToInclude}` +
                `&body=${this._win.navigator.userAgent}\n\n` +
                `window.devicePixelRatio : ${this._win.devicePixelRatio}\n` +
                `screen.width x height : ${this._win.screen.width} x ${this._win.screen.height}\n` +
                `window.innerWidth x innerHeight : ${this._win.innerWidth} x ${this._win.innerHeight}\n` +
                `window.navigator.standalone : ${this._win.navigator.standalone}\n` +
                `window.orientation : ${this._win.orientation}\n\n` +
                `navigator.javaEnabled() : ${this._win.navigator.javaEnabled()}\n` +
                `${navigatorInfo}`

            this._win.location.href = `mailto:detect.js.org@gmail.com?` +
                `${encodeEmailCorrectly(generatedLink, this._win.navigator.userAgent)}`
        })

        function encodeEmailCorrectly(generatedLink, userAgent) {
            if (/(?:baidubrowser|bdbrowser)/i.test(userAgent)) {
                return encodeURIComponent(generatedLink);
            } else {
                return encodeURI(generatedLink);
            }
        }

        this._win.document.getElementsByClassName('disable')[0].addEventListener('click', event => {
            let self = this._win.document.getElementsByClassName('disable')[0]

            if (self.innerHTML.indexOf('disable') !== -1) {
                this._win.localStorage.setItem('SwipeUp._disabled', 'true')
                swipeUp.disable()
                this._debugWidget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                self.innerHTML = 'enable'
                self.style.backgroundImage = 'url("assets/add.png")'
            } else {
                this._win.localStorage.setItem('SwipeUp._disabled', 'false')
                swipeUp.enable()
                this._debugWidget.style.backgroundColor = 'initial'
                self.innerHTML = 'disable'
                self.style.backgroundImage = 'url("assets/remove.png")'
            }
        })
    }

    update() {
        if (this._debugWidget.style.display === 'none') return

        this._debugWidget.style.backgroundColor = this._browserUiState.state === 'COLLAPSED' ?
                                                    'initial' : 'rgba(0, 0, 0, 0.5)'

        const ownVersion = version
        const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)
        const devicePixelRatio = +this._win.devicePixelRatio.toFixed(2)
        const screenDimensions = this._win.screen.width + 'x' + this._win.screen.height
        const windowDimensions = this._win.innerWidth + 'x' + this._win.innerHeight
        const screenType = this._win.screen.orientation ? this._win.screen.orientation.type.replace(/(.).*-(.).*/, '$1$2') : '-'
        const orientation = this._browserUiState.orientation[0]
        const html5FullscreenIsAvailable = this._browserUiState.fscreen.fullscreenEnabled ? 'Y' : 'N'
        const html5FullscreenIsAvailable2 = document.fullscreenEnabled ? 'Y' : typeof document.fullscreenEnabled !== 'undefined' ? 'N' : 'U'
        const html5FullscreenIsOn = !!this._browserUiState.fscreen.fullscreenElement ? 'Y' : 'N'
        const standalone = this._win.navigator.standalone ? 'Y' : typeof this._win.navigator.standalone !== 'undefined' ? 'N' : 'U'
        const collapsedThreshold = `${this._browserUiState.collapsedThreshold}%`
        const deviation = `${this._browserUiState.deviation.toFixed(2)}%`
        const keyboardThreshold = `${this._browserUiState.keyboardThreshold}%`
        const state = this._browserUiState.state.toLowerCase()
        const userAgent = this._win.navigator.userAgent
        const userAgentName = this._browserUiState._userAgentDetector.userAgent ? this._browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'
        const deviceName = this._browserUiState._provider._device ? this._browserUiState._provider._device.toLowerCase() : '...'

        this._debugAllReadings.innerHTML =
            `v${ownVersion} :` +
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
            `<span class='state'>${state}</span>`

        this._debugUserAgent.innerHTML =
            `${userAgentName} : ` +
            `${deviceName} : ` +
            `${userAgent}`
    }

    show() {
        this._debugWidget.style.display = 'block'
        this._debugWidget.style.backgroundColor = this._browserUiState.state === 'COLLAPSED' ?
            'initial' : 'rgba(0, 0, 0, 0.5)'
    }

    hide() {
        this._debugWidget.style.display = 'none'
    }

    toggle() {
        if (this._debugWidget.style.display === 'block') {
            this.hide()
        } else {
            this.show()
        }
    }
}

export default DebugWidget