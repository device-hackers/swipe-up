import {version, dependencies} from '../../../../package.json'
import ControlButton from './control-button'

export default class EmailButton extends ControlButton {
    constructor(debugWidget) {
        super('email')
        let win = debugWidget._win
        let fscreen = debugWidget._browserUiState.fscreen

        super.click( () => {
            let deviceInfoToInclude = prompt('Please enter your device and browser name', '')
            if (deviceInfoToInclude === null) return
            let navigatorInfo = ''

            for (let prop in win.navigator) {
                if (!(win.navigator[prop] instanceof Function) &&
                    !(win.navigator[prop] instanceof Object)) {
                    navigatorInfo += `navigator.${prop} : ${win.navigator[prop]}\n`
                }
            }

            const ownVersion = version
            const browserUiStateVersion = dependencies['browser-ui-state'].substr(1)

            let generatedLink =
                `subject=[SwipeUp] ${deviceInfoToInclude}` +
                `&body=${debugWidget.recordAllReadings.
                    replace(/<b>|<\/b>|<u>|<\/u>/g, '').
                    replace(/<br>/g, '\n')}\n` +
                `${debugWidget.recordUserAgent}\n` +
                `${debugWidget.recordSwipeUpOptions.
                    replace(/<i>|<\/i>/g, '')}\n\n` +
                `window.orientation : ${win.orientation}\n` +
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