module.exports = class args {

    getConditions(arg = '') {
        const valExp = new RegExp("(?<==).*")
        const keyExp = new RegExp(".+(?==)")
        const isEqual = arg.trim() === '='
        const isFlag = (arg.includes('-') || arg.includes('--')) && arg.indexOf('-') === 0
        const hasEqual = arg.includes('=')
        const startsWithEqual = arg[0] === '='
        const hasValueInside = hasEqual ? arg.indexOf('=') < arg.length - 1 : false
        const value = isFlag ?
            (hasValueInside ?
                (valExp.exec(arg) != null ?
                    valExp.exec(arg)[0] : true) :
                true) :
            (valExp.exec(arg) != null ?
                valExp.exec(arg)[0] : null)
        const key = hasEqual && !isEqual ? keyExp.exec(arg)[0] : arg.replace(/-/g, '')
        return {
            isEqual,
            isFlag,
            hasEqual,
            startsWithEqual,
            hasValueInside,
            value,
            key
        }
    }

    getArgs(tempArgs = [], argObj = {}) {
        if (tempArgs.length === 0) return argObj
        const tempArr = [...tempArgs]
        const key = tempArr.shift();
        const conditions = this.getConditions(key)

        if (conditions.startsWithEqual || conditions.isEqual) return (this.getArgs(tempArr, argObj))
        if (conditions.hasValueInside) {
            if (conditions.value === null) this.getArgs(tempArr, argObj)
            let newObj = { ...argObj }
            newObj[conditions.key] = conditions.value
            return this.getArgs(tempArr, newObj)
        }
        if (conditions.isFlag) {
            if (conditions.value === null) this.getArgs(tempArr, argObj)
            let newObj = { ...argObj }
            newObj[conditions.key] = conditions.value
            return this.getArgs(tempArr, newObj)
        }
        if (tempArr[0] != undefined) {
            const nextArg = tempArr[0] //watchout, at returning this has to be shifted
            const nextConditions = this.getConditions(nextArg)
            if (nextConditions.startsWithEqual && !nextConditions.isEqual && nextConditions.hasValueInside) {
                let newObj = { ...argObj }
                newObj[conditions.key] = nextConditions.value
                tempArr.shift()
                return this.getArgs(tempArr, newObj)
            }
            if (nextConditions.isEqual && tempArr[1] != undefined) {
                const afterNextArg = tempArr[1] //watchout, at returning this has to be shifted
                const afterNextConditions = this.getConditions(afterNextArg)
                if (!afterNextConditions.startsWithEqual && !afterNextConditions.isEqual && !afterNextConditions.hasEqual && !afterNextConditions.isFlag) {
                    let newObj = { ...argObj }
                    newObj[conditions.key] = afterNextArg
                    tempArr.shift()
                    tempArr.shift()
                    return this.getArgs(tempArr, newObj)
                }
            }
        }
        return this.getArgs(tempArr, argObj)

    }

    constructor() {
        const cliArgs = process.argv //"-log port=1234 host = localhost flag".split(' ') -> { log: true, port: '1234', host: 'localhost' } 
        this._args = this.getArgs(cliArgs)
    }

    get(arg) {
        return this._args[arg]
    }
    getAll() {
        return this._args
    }
}