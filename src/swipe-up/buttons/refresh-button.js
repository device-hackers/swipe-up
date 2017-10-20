import ControlButton from './control-button'

export default class RefreshButton extends ControlButton {
    constructor(debugWidget) {
        super('refresh')
        super.click( () => debugWidget.update() )
    }
}