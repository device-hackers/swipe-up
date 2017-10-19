import {version, dependencies} from '../../package.json'
import $ from '../util/dom'

class KeyboardButton {
    constructor(debugWidget) {
        let parentContainer = debugWidget._debugButtons

        let input = document.createElement('input')
        input.className = 'inputForKeyboard'
        input.setAttribute('tabindex', 0)
        parentContainer.appendChild(input)

        let selfName = 'keyboard'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        $('.keyboard').click(() => $('.inputForKeyboard').focus())
    }
}

class RefreshButton {
    constructor(debugWidget) {
        let parentContainer = debugWidget._debugButtons
        let selfName = 'refresh'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        $('.refresh').click(() => debugWidget.update())
    }
}

class FullScreenButton {
    constructor(debugWidget) {
        let fscreen = debugWidget._browserUiState.fscreen
        let parentContainer = debugWidget._debugButtons
        let selfName = 'fullscreen'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        $('.fullscreen').click(event => {
            let self = event.target

            if (fscreen.fullscreenElement) {
                fscreen.exitFullscreen()
                self.style.backgroundImage = 'url("assets/fullscreen-enter.png")'
            } else {
                fscreen.requestFullscreen(debugWidget._win.document.documentElement)
                self.style.backgroundImage = 'url("assets/fullscreen-exit.png")'
            }
        })
    }
}

class LockScreenButton {
    constructor(debugWidget) {
        let win = debugWidget._win
        let parentContainer = debugWidget._debugButtons
        let selfName = 'lock'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        $('.lock').click(event => {
            let orientationToLockTo =
                debugWidget._browserUiState.orientation === 'LANDSCAPE' ? 'portrait' : 'landscape'
            let self = event.target

            if (LockScreenButton.isModernLockScreenSupported(win)) {
                LockScreenButton.lockModern(win, self, orientationToLockTo)
            } else {
                LockScreenButton.lockLegacy(win, self, orientationToLockTo)
            }
        })
    }

    static isModernLockScreenSupported(win) {
        return win.screen.orientation && win.screen.orientation.lock
    }

    static isLegacyLockScreenSupported(win) {
        return win.screen.lockOrientation || win.screen.mozLockOrientation || win.screen.msLockOrientation
    }

    static lockModern(win, self, orientationToLockTo) {
        if (self.innerHTML === 'lock') {
            win.screen.orientation.lock(orientationToLockTo)
                .then(() => LockScreenButton.setLocked(self))
                .catch((err) => console.error('Orientation lock failed: ', err))
        } else {
            win.screen.orientation.unlock()
            LockScreenButton.setUnlocked(self)
        }
    }

    static lockLegacy(win, self, orientationToLockTo) {
        let lockOrientation = win.screen.lockOrientation || win.screen.mozLockOrientation || win.screen.msLockOrientation
        let unlockOrientation = win.screen.unlockOrientation || win.screen.mozUnlockOrientation || win.screen.msUnlockOrientation

        if (self.innerHTML === 'lock' && lockOrientation(orientationToLockTo)) {
            LockScreenButton.setLocked(self)
        } else {
            console.error('Orientation lock failed')
        }

        if (self.innerHTML === 'unlock' && unlockOrientation()) {
            LockScreenButton.setUnlocked(self)
        } else {
            console.error('Orientation unlock failed')
        }
    }

    static setLocked(self) {
        console.log('Orientation was locked')
        self.innerHTML = 'unlock'
        self.style.backgroundImage = 'url("assets/unlock.png")'
    }

    static setUnlocked(self) {
        console.log('Orientation was unlocked')
        self.innerHTML = 'lock'
        self.style.backgroundImage = 'url("assets/lock.png")'
    }
}

class EmailButton {
    constructor(debugWidget) {
        let win = debugWidget._win
        let parentContainer = debugWidget._debugButtons
        let selfName = 'email'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        $('.email').click(() => {
            let deviceInfoToInclude = prompt('Please enter your device and browser name', '')
            let navigatorInfo = ''

            for (let prop in win.navigator) {
                if (!(win.navigator[prop] instanceof Function) &&
                    !(win.navigator[prop] instanceof Object)) {
                    navigatorInfo += `navigator.${prop} : ${win.navigator[prop]}\n`
                }
            }

            let generatedLink =
                `subject=[SwipeUp] ${deviceInfoToInclude}` +
                `&body=${win.navigator.userAgent}\n\n` +
                `window.devicePixelRatio : ${win.devicePixelRatio}\n` +
                `screen.width x height : ${win.screen.width} x ${win.screen.height}\n` +
                `window.innerWidth x innerHeight : ${win.innerWidth} x ${win.innerHeight}\n` +
                `window.navigator.standalone : ${win.navigator.standalone}\n` +
                `window.orientation : ${win.orientation}\n\n` +
                `navigator.javaEnabled() : ${win.navigator.javaEnabled()}\n` +
                `${navigatorInfo}`

            win.location.href = `mailto:detect.js.org@gmail.com?` +
                `${EmailButton.encodeEmailCorrectly(generatedLink, win.navigator.userAgent)}`
        })
    }

    static encodeEmailCorrectly(generatedLink, userAgent) {
        if (/(?:baidubrowser|bdbrowser)/i.test(userAgent)) {
            return encodeURIComponent(generatedLink);
        } else {
            return encodeURI(generatedLink);
        }
    }
}

class DisableButton {
    constructor(debugWidget, swipeUp) {
        let win = debugWidget._win
        let parentContainer = debugWidget._debugButtons
        let selfName = 'disable'

        let self = document.createElement('button')
        self.className = self.innerHTML = selfName
        parentContainer.appendChild(self)

        self = $(`.${selfName}`)
        let swipeUpDisabled = (win.localStorage.getItem('SwipeUp._disabled') === 'true')

        if (swipeUpDisabled) {
            self.html('enable')
            self.style.backgroundImage = 'url("assets/add.png")'
        }

        self.click(event => {
            let self = event.target

            if (self.innerHTML.indexOf(selfName) !== -1) {
                win.localStorage.setItem('SwipeUp._disabled', 'true')
                swipeUp.disable()
                debugWidget._debugWidgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                self.innerHTML = 'enable'
                self.style.backgroundImage = 'url("assets/add.png")'
            } else {
                win.localStorage.setItem('SwipeUp._disabled', 'false')
                swipeUp.enable()
                debugWidget._debugWidgetContainer.style.backgroundColor = 'initial'
                self.innerHTML = selfName
                self.style.backgroundImage = 'url("assets/remove.png")'
            }
        })
    }
}

class CloseMeButton {
    constructor(debugWidget) {
        this._debugWidget =  debugWidget
        this._selfName = 'debugWidgetCloseBtn'

        let self = document.createElement('button')
        self.className = this._selfName
        self.innerHTML = 'x'
        this._debugWidget._debugWidgetContainer.appendChild(self)
    }

    attachClickAfterButtonAddedToDom() {
        $(`.${this._selfName}`).click(() => this._debugWidget.hide())
    }
}

export default class DebugWidget {
    constructor(swipeUp, win = window) {
        this._win = win
        this._browserUiState = swipeUp.browserUiState

        this._debugWidgetContainer = document.createElement('div')
        this._debugWidgetContainer.className = 'debugWidget'

        let closeMeButton = new CloseMeButton(this)

        this._debugAllReadings = document.createElement('div')
        this._debugAllReadings.className = 'debugAllReadings'
        this._debugWidgetContainer.appendChild(this._debugAllReadings)

        this._debugUserAgent = document.createElement('div')
        this._debugUserAgent.className = 'debugUserAgent'
        this._debugWidgetContainer.appendChild(this._debugUserAgent)

        this._debugButtons = document.createElement('div')
        this._debugButtons.className = 'debugButtons'
        this._debugWidgetContainer.appendChild(this._debugButtons)

        this.update()

        this._win.document.body.appendChild(this._debugWidgetContainer)

        closeMeButton.attachClickAfterButtonAddedToDom()

        if (!this._browserUiState.fscreen.fullscreenEnabled) {
            $('.fullscreen').classList.add('disabled')
        }

        if (!LockScreenButton.isModernLockScreenSupported(this._win) &&
            !LockScreenButton.isLegacyLockScreenSupported(this._win)) {
            $('.lock').classList.add('disabled')
        }

        new KeyboardButton(this)
        new RefreshButton(this)
        new FullScreenButton(this)
        new LockScreenButton(this)
        new EmailButton(this)
        new DisableButton(this, swipeUp)
    }

    update() {
        if (this._debugWidgetContainer.style.display === 'none') return

        this._debugWidgetContainer.style.backgroundColor =
            this._browserUiState.state === 'COLLAPSED' ? 'initial' : 'rgba(0, 0, 0, 0.5)'

        const ownVersion = version
        const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)
        const devicePixelRatio = +this._win.devicePixelRatio.toFixed(2)
        const screenDimensions = this._win.screen.width + 'x' + this._win.screen.height
        const windowDimensions = this._win.innerWidth + 'x' + this._win.innerHeight

        const screenType = this._win.screen.orientation ?
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
        const userAgent = this._win.navigator.userAgent

        const userAgentName = this._browserUiState._userAgentDetector.userAgent ?
            this._browserUiState._userAgentDetector.userAgent.toLowerCase() : '...'

        const deviceName = this._browserUiState._provider._device ?
            this._browserUiState._provider._device.toLowerCase() : '...'

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
        this._debugWidgetContainer.style.display = 'block'
        this._debugWidgetContainer.style.backgroundColor =
            this._browserUiState.state === 'COLLAPSED' ? 'initial' : 'rgba(0, 0, 0, 0.5)'
    }

    hide() {
        this._debugWidgetContainer.style.display = 'none'
    }

    toggle() {
        if (this._debugWidgetContainer.style.display === 'block') {
            this.hide()
        } else {
            this.show()
        }
    }
}