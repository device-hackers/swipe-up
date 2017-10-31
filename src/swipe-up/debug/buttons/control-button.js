import $ from '../../utils/dom'

export default class ControlButton {
    constructor(selfName) {
        this._selfName = selfName
        let button = document.createElement('button')
        button.setAttribute('class', `${selfName}-button`)
        button.innerHTML = selfName
        $('.debugButtons').append(button)
    }

    click(handler) {
        $(`.${this._selfName}-button`).click(handler)
    }
}