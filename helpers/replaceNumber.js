function replaceNumber(text){
    if (text === "undefined")
        return text

    let number = text.replace(/\+/gm,'')
        .replace(/\s/gm,'')
        .split(' ')
        .join('')
        .replace(/\-/gm,'')
        .replace('(','')
        .replace(')','');
    return " +38" + number.substr(number.length - 10);
}
module.exports = {replaceNumber};
