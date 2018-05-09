export const strReverse1 = s => s ? strReverse1(s.substr(1)) + s[0] : ''
export const strReverse2 = s => s.split('').reverse().join('')
