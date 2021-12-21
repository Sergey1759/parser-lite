function replaceNumber(text){
    if (text === "undefined" || text === "orizedUser")
        return text

    console.log(text);

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
