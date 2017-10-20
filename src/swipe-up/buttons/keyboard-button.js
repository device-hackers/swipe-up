import $ from '../../util/dom'
import ControlButton from './control-button'

export default class KeyboardButton extends ControlButton {
    constructor(debugWidget) {
        let selfName = 'keyboard'
        super(selfName, `<input class='inputForKeyboard' tabindex='0'>` +
            `<button class='${selfName}'>${selfName}</button>`)

        super.click( () => $('.inputForKeyboard').focus() )
    }
}