function replaceNumber(text){
    let number = text.replace(/\+/gm,'')
        .replace(/\s/gm,'')
        .split(' ')
        .join('')
        .replace(/\-/gm,'')
        .replace('(','')
        .replace(')','');
    return number.substr(number.length - 10);
}
module.exports = {replaceNumber};
