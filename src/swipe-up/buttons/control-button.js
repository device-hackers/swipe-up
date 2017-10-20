import $ from '../../util/dom'

export default class ControlButton {
    constructor(selfName, content) {
        this._selfName = selfName
        $('.debugButtons').append(content ? content : `<button class='${selfName}'>${selfName}</button>`)
    }

    /**
     * Due to the fact we rely on innerHTML, so then adding click handler immediately after new element added via it -
     * may result into element not yet available for $/querySelector, thus click handler not assigned. Fixed via timeout.
     * @param handler Click handler to be assigned
     */
    click(handler) {
        setTimeout(() => $(`.${this._selfName}`).click(handler), 0)
    }
}