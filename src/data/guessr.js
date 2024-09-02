export const photos = [
  {
    date: "2024-09-02 16:47:01",
    x: "80",
    y: "206",
    author: "lukas",
    url: "3a15c34a-5235-4b79-a78f-13a53eb11cc8.png",
  },
  {
    date: "2024-09-02 16:47:19",
    x: "229",
    y: "264",
    author: "lukas",
    url: "e4367d10-dc5c-40b4-8601-fb71b02c43a8.png",
  },
  {
    date: "2024-09-02 16:47:30",
    x: "234",
    y: "273",
    author: "lukas",
    url: "0b5aee70-79a3-4eac-af87-cc7d4fe93d10.png",
  },
  {
    date: "2024-09-02 16:47:39",
    x: "238",
    y: "108",
    author: "lukas",
    url: "002ca65f-7dde-4e7d-bb27-0dfc8693281f.png",
  },
  {
    date: "2024-09-02 16:47:49",
    x: "247",
    y: "89",
    author: "lukas",
    url: "4a23b233-ce29-42a7-bf8b-84b3eb3991f8.png",
  },
  {
    date: "2024-09-02 16:47:57",
    x: "300",
    y: "71",
    author: "lukas",
    url: "58a44a5a-f5b6-43af-894e-82ca1a373133.png",
  },
  {
    date: "2024-09-02 16:48:08",
    x: "337",
    y: "131",
    author: "lukas",
    url: "8d03225f-a58e-4edb-a0c9-3b76a4890ca5.png",
  },
  {
    date: "2024-09-02 16:48:20",
    x: "185",
    y: "229",
    author: "Wyczka",
    url: "70cad8fc-fbb0-4bb8-a64e-87850a4413d5.png",
  },
  {
    date: "2024-09-02 16:48:28",
    x: "204",
    y: "182",
    author: "Wyczka",
    url: "514dfd05-2976-44df-8f11-9a1804cecaa4.png",
  },
  {
    date: "2024-09-02 16:48:36",
    x: "242",
    y: "193",
    author: "Wyczka",
    url: "92f558f7-6d0f-4f31-b3dc-09856135c59a.png",
  },
  {
    date: "2024-09-02 16:48:45",
    x: "247",
    y: "91",
    author: "Wyczka",
    url: "6e744d3b-c5e5-47f5-ac03-14229926446e.png",
  },
  {
    date: "2024-09-02 16:48:52",
    x: "288",
    y: "390",
    author: "Wyczka",
    url: "548f04db-539f-4584-bf82-59bf313a29cc.png",
  },
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
