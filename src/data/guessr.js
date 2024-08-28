export const photos = [
  { x: 300, y: 71, url: "300x71.png" },
  { x: 337, y: 131, url: "337x131.png" },
  { x: 80, y: 206, url: "80x206.png" },
  { x: 234, y: 273, url: "234x273.png" },
];

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

export function getRandomPhotos(count) {
  return getRandomElements(photos, count);
}
