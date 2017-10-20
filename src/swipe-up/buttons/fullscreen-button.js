import $ from '../../util/dom'
import ControlButton from './control-button'

export default class FullScreenButton extends ControlButton {
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

        if (!fscreen.fullscreenEnabled) {
            $('.fullscreen').classList.add('disabled')
        }
    }
}