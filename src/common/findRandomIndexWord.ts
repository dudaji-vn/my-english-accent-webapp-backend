export function findRandomIndexWord(inputString: string) {
  const wordIndices = []
  const words = inputString.split(/\s+/)

  let currentIndex = 0

  for (const word of words) {
    const startIndex = inputString.indexOf(word, currentIndex)
    wordIndices.push(startIndex)
    currentIndex = startIndex + word.length
  }
  const randomIndex = Math.floor(Math.random() * wordIndices.length)
  return wordIndices[randomIndex]
}
