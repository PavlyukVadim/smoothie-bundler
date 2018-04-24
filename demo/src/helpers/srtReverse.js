const strReverse = s => s ? strReverse(s.substr(1)) + s[0] : ''

export default strReverse
