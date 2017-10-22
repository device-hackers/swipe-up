import $ from '../../../utils/dom'
import ControlButton from './control-button'

const localStorageDisableKey = 'SwipeUp._disabled'

export default class DisableButton extends ControlButton {
    constructor(debugWidget, swipeUp) {
        super('disable')
        let win = debugWidget._win
        let selfName = 'disable'

        let swipeUpDisabled = (win.localStorage.getItem(localStorageDisableKey) === 'true')
        let self = $(`.${selfName}`)

        if (swipeUpDisabled) {
            self.html('enable')
            self.style.backgroundImage = 'url("assets/add.png")'
        }

        super.click( event => {
            let self = event.target

            if ($(self).html().indexOf(selfName) !== -1) {
                win.localStorage.setItem(localStorageDisableKey, 'true')
                swipeUp.disable()
                debugWidget._debugWidgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                self.style.backgroundImage = 'url("assets/add.png")'
                $(self).html('enable')
            } else {
                win.localStorage.setItem(localStorageDisableKey, 'false')
                swipeUp.enable()
                debugWidget._debugWidgetContainer.style.backgroundColor = swipeUp.isShown ? 'initial' : 'rgba(0, 0, 0, 0.5)'
                self.style.backgroundImage = 'url("assets/remove.png")'
                $(self).html(selfName)
            }
        } )
    }
}