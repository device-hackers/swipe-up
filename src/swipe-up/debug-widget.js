import {version, dependencies} from '../../package.json'
import $ from '../util/dom'


class ControlButton {
    constructor(selfName, content) {
        this._selfName = selfName
        $('.debugButtons').append(content ? content : `<button class='${selfName}'>${selfName}</button>`)
    }

    /**
     * Due to the fact we rely on innerHTML, so then adding click handler immediately after new element added via it -
     * may result into element not yet available for $/querySelector, thus click handler not assigned. Fixed via timeout.
     * @param handler Click handler to be assigned
     */
    click(handler) {
        setTimeout(() => $(`.${this._selfName}`).click(handler), 0)
    }
}

class KeyboardButton extends ControlButton {
    constructor(debugWidget) {
        let selfName = 'keyboard'
        super(selfName, `<input class='inputForKeyboard' tabindex='0'>` +
                        `<button class='${selfName}'>${selfName}</button>`)

        super.click( () => $('.inputForKeyboard').focus() )
    }
}

class RefreshButton extends ControlButton {
    constructor(debugWidget) {
        super('refresh')
        super.click( () => debugWidget.update() )
    }
}

class FullScreenButton extends ControlButton {
    constructor(debugWidget) {
        super('fullscreen')
        let fscreen = debugWidget._browserUiState.fscreen

        super.click( event => {
            let self = event.target

            if (fscreen.fullscreenElement) {
                fscreen.exitFullscreen()
                self.style.backgroundImage = 'url("assets/fullscreen-enter.png")'
            } else {
                fscreen.requestFullscreen(debugWidget._win.document.documentElement)
                self.style.backgroundImage = 'url("assets/fullscreen-exit.png")'
            }
        } )
    }
}

class LockScreenButton extends ControlButton {
    constructor(debugWidget) {
        super('lock')
        let win = debugWidget._win

        super.click( event => {
            let orientationToLockTo = debugWidget._browserUiState.orientation === 'LANDSCAPE' ? 'portrait' : 'landscape'

            if (LockScreenButton.isModernLockScreenSupported(win)) {
                LockScreenButton.lockModern(win, event.target, orientationToLockTo)
            } else {
                LockScreenButton.lockLegacy(win, event.target, orientationToLockTo)
            }
        } )
    }

    static isModernLockScreenSupported(win) {
        return win.screen.orientation && win.screen.orientation.lock
    }

    static isLegacyLockScreenSupported(win) {
        return win.screen.lockOrientation || win.screen.mozLockOrientation || win.screen.msLockOrientation
    }

    static lockModern(win, self, orientationToLockTo) {
        if ($(self).html() === 'lock') {
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

        if ($(self).html() === 'lock' && lockOrientation(orientationToLockTo)) {
            LockScreenButton.setLocked(self)
        } else {
            console.error('Orientation lock failed')
        }

        if ($(self).html() === 'unlock' && unlockOrientation()) {
            LockScreenButton.setUnlocked(self)
        } else {
            console.error('Orientation unlock failed')
        }
    }

    static setLocked(self) {
        console.log('Orientation was locked')
        $(self).html('unlock')
        self.style.backgroundImage = 'url("assets/unlock.png")'
    }

    static setUnlocked(self) {
        console.log('Orientation was unlocked')
        $(self).html('lock')
        self.style.backgroundImage = 'url("assets/lock.png")'
    }
}

class EmailButton extends ControlButton {
    constructor(debugWidget) {
        super('email')
        let win = debugWidget._win

        super.click( () => {
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
                `window.orientation : ${win.orientation}\n` +
                `screen.orientation.type : ${win.screen.orientation ? win.screen.orientation.type : 'N/A'}\n\n` +
                `navigator.javaEnabled() : ${win.navigator.javaEnabled()}\n` +
                `${navigatorInfo}`

            win.location.href = `mailto:detect.js.org@gmail.com?` +
                `${EmailButton.encodeEmailCorrectly(generatedLink, win.navigator.userAgent)}`
        } )
    }

    static encodeEmailCorrectly(generatedLink, userAgent) {
        if (/(?:baidubrowser|bdbrowser)/i.test(userAgent)) {
            return encodeURIComponent(generatedLink);
        } else {
            return encodeURI(generatedLink);
        }
    }
}

class DisableButton extends ControlButton {
    constructor(debugWidget, swipeUp) {
        super('disable')
        let win = debugWidget._win
        let selfName = 'disable'

        let swipeUpDisabled = (win.localStorage.getItem('SwipeUp._disabled') === 'true')
        let self = $(`.${selfName}`)

        if (swipeUpDisabled) {
            self.html('enable')
            self.style.backgroundImage = 'url("assets/add.png")'
        }

        super.click( event => {
            let self = event.target

            if ($(self).html().indexOf(selfName) !== -1) {
                win.localStorage.setItem('SwipeUp._disabled', 'true')
                swipeUp.disable()
                debugWidget._debugWidgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                $(self).html('enable')
                self.style.backgroundImage = 'url("assets/add.png")'
            } else {
                win.localStorage.setItem('SwipeUp._disabled', 'false')
                swipeUp.enable()
                debugWidget._debugWidgetContainer.style.backgroundColor = 'initial'
                $(self).html(selfName)
                self.style.backgroundImage = 'url("assets/remove.png")'
            }
        } )
    }
}

class CloseMeButton {
    constructor(debugWidget) {
        this._debugWidget =  debugWidget
        this._selfName = 'debugWidgetCloseBtn'

        let self = document.createElement('button')
        self.className = this._selfName
        $(self).html('x')
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

        $(this._debugWidgetContainer).append(
            '<div class="debugAllReadings"></div>'+
            '<div class="debugUserAgent"></div>' +
            '<div class="debugButtons"></div>')
        this._win.document.body.appendChild(this._debugWidgetContainer)

        this.update()

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

        $('.debugAllReadings').html(
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
        )

        $('.debugUserAgent').html(
            `${userAgentName} : ` +
            `${deviceName} : ` +
            `${userAgent}`
        )
    }

    show() {
        $(this._debugWidgetContainer).show()
        this._debugWidgetContainer.style.backgroundColor =
            this._browserUiState.state === 'COLLAPSED' ? 'initial' : 'rgba(0, 0, 0, 0.5)'
    }

    hide() {
        $(this._debugWidgetContainer).hide()
    }

    toggle() {
        $(this._debugWidgetContainer).toggle()
    }
}