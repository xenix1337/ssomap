export const photos = [];

function getRandomElements(array, numberOfElements) {
  const result = [];
  const arrayCopy = array.slice();

  for (let i = 0; i < numberOfElements && arrayCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    const randomElement = arrayCopy.splice(randomIndex, 1)[0];
    result.push(randomElement);
  }

  return result;
}

export function getRandomPhotos(sourceData, count) {
  return getRandomElements(sourceData, count);
}
