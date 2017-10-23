import $ from '../../../utils/dom'
import ControlButton from './control-button'

export default class KeyboardButton extends ControlButton {
    constructor(debugWidget) {
        let selfName = 'keyboard'
        let input = document.createElement('input')
        input.setAttribute('class', 'inputForKeyboard')
        input.setAttribute('tabindex', 0)
        $('.debugButtons').append(input)
        super(selfName)

        super.click( () => $('.inputForKeyboard').focus() )
    }
}