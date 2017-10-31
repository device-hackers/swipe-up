import $ from '../../utils/dom'
import ControlButton from './control-button'

export default class FullScreenButton extends ControlButton {
    constructor(debugWidget) {
        super('fullscreen')
        let fscreen = debugWidget._browserUiState.fscreen

        super.click( event => {
            let self = event.target

            if (fscreen.fullscreenElement) {
                fscreen.exitFullscreen()
                $(self).html('fullscreen')
            } else {
                fscreen.requestFullscreen(debugWidget._win.document.documentElement)
                $(self).html('exit')
            }
        } )

        if (!fscreen.fullscreenEnabled) {
            $('.fullscreen-button').classList.add('disabled')
        }
    }
}