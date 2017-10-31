import $ from '../../utils/dom'

export default class CloseMeButton {
    constructor(debugWidget) {
        this._debugWidget =  debugWidget
        this._selfName = 'debugWidgetCloseBtn'

        let self = document.createElement('button')
        self.className = this._selfName
        $(self).html('x')
        this._debugWidget._debugWidgetContainer.appendChild(self)
    }

    attachClickAfterButtonAddedToDom() {
        $(`.${this._selfName}`).click(() => this._debugWidget.hide())
    }
}