import $ from '../../utils/dom'
import ControlButton from './control-button'

export default class KeyboardButton extends ControlButton {
    constructor(debugWidget) {
        let selfName = 'keyboard'

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
            button.addEventListener('click', () => {
                $('.selfRemove').get().remove()
                $('.inputForKeyboard').style.width = '1px'
            })
            return button
        }

        $('.debugButtons').append(createInput())

        super(selfName)

        super.click( () => {
            let debugButtons = $('.debugButtons').get()
            let inputForKeyboard = $('.inputForKeyboard').get()
            let keyboard = $('.keyboard-button').get()
            let selfRemove = $('.selfRemove').get()

            if (!selfRemove) {
                debugButtons.insertBefore(createSelfRemoveButton(), keyboard)
                $('.inputForKeyboard').style.width = '20px'
            }

            inputForKeyboard.focus()
        } )
    }
}