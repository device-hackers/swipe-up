import $ from '../../utils/dom'
import ControlButton from './control-button'

export default class KeyboardButton extends ControlButton {
    constructor(debugWidget) {
        let selfName = 'keyboard'

        let createSelfRemoveContainer = () => {
            let div = document.createElement('div')
            div.setAttribute('class', 'selfRemoveContainer')
            return div
        }

        let createInput = () => {
            let input = document.createElement('input')
            input.setAttribute('class', 'inputForKeyboard')
            input.setAttribute('tabindex', 0)
            return input
        }

        let createSelfRemoveButton = () => {
            let button = document.createElement('button')
            button.setAttribute('class', 'selfRemove')
            button.innerHTML = 'X'
            button.style.width = '1.5em'
            button.style.flex = 'initial'
            button.addEventListener('click', () => $('.selfRemoveContainer').get().remove())
            return button
        }

        super(selfName)

        super.click( () => {
            if (!$('.selfRemoveContainer').get()) {
                $('.debugButtons').get().insertBefore(createSelfRemoveContainer(), $('.keyboard-button').get())
                $('.selfRemoveContainer').get().appendChild(createInput())
                $('.selfRemoveContainer').get().appendChild(createSelfRemoveButton())
                $('.inputForKeyboard').style.width = '20px'
            }

            $('.inputForKeyboard').focus()
        } )
    }
}