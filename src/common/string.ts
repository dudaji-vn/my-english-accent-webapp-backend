export function removeSpecialCharacters(inputString: string) {
  const regex = /[\s°+!@#$%^&*()_+{}[\]:;<>,.?~\\/-=""]/g
  const result = inputString.toLocaleLowerCase().replace(regex, '')
  return result
}
