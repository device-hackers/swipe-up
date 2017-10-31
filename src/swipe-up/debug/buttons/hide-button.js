import $ from '../../utils/dom'
import ControlButton from './control-button'

/**
 * Hides or shows Swipe Up itself (.swipeUpOverlay) just for debugging purposes, mainly to check on devices
 * and/or browsers which are not yet supported by browser-ui-state.
 * Timeouts are required due to optimized resize evens (throttled via requestAnimationFrame) which may lead
 * to situations where Swipe Up is first hidden by this button click, but then shown immediately again because
 * of optimized resize fired (case when debug widget is not displayed initially, but then shown via quick taps
 * combination in top left corner, but last tap touches input near "keyboard" button, producing resize event)
 */
export default class HideButton extends ControlButton {
    constructor(debugWidget, swipeUp) {
        let selfName = 'hide'
        super(selfName)
        let win = debugWidget._win

        let self = $(`.${selfName}-button`)

        setTimeout( () => {
            if (swipeUp.isShown) {
                self.html(selfName)
            } else {
                self.html('show')
            }
        }, 66)

        super.click( event => {
            setTimeout( () => {
                let self = event.target

                if ($(self).html().indexOf(selfName) !== -1) {
                    $('.swipeUpOverlay').hide()
                    debugWidget._debugWidgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                    $(self).html('show')
                } else {
                    $('.swipeUpOverlay').show()
                    debugWidget._debugWidgetContainer.style.backgroundColor =
                        swipeUp.isShown ? 'initial' : 'rgba(0, 0, 0, 0.5)'
                    $(self).html(selfName)
                }
            }, 66)
        } )
    }
}