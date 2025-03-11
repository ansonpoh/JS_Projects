
export function getCustomProperty(elem, prop) {
    //Get css value and property, converting it to a number and if no number default 0
    //getComputedStyle gets css of the element
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}

export function setCustomProperty(elem, prop, value) {
    //Sets css property for element
    elem.style.setProperty(prop, value)
}

export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc )
}

