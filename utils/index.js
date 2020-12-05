const { readdirSync } = require("fs");

module.exports = {
    all: (arr, fn = Boolean) => arr.every(fn),
    getDirectories: source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name),
    getFiles: source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => dirent.name),
    isFunction: (functionToCheck) => {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
} 