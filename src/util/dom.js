function Wrap(ref) {
    this.ref = ref
}

Wrap.prototype.click = function (handler) {
    if (this.ref) this.ref.addEventListener('click', handler)
}

Wrap.prototype.focus = function () {
    if (this.ref) this.ref.focus()
}

Wrap.prototype.classList = function (className) {
    if (this.ref) return this.ref.classList
}

Wrap.prototype.html = function (htmlString) {
    if (this.ref && htmlString) this.ref.innerHTML = htmlString
    else if (this.ref) return this.ref.innerHTML
}

Wrap.prototype.style = function () {
    if (this.ref) return this.ref.style
}

export default function $(selector) {
    let element = selector instanceof HTMLElement ? selector : document.querySelector(selector)
    return new Wrap(element)
}