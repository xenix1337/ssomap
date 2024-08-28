export const calculatePoints = (
  acceptableDistance,
  maxDistance,
  maxPoints,
  from,
  to
) => {
  console.log(from, to);
  const distance =
    (Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)) /
      1024) *
    409;
  console.log("distance = " + distance);
  if (distance <= acceptableDistance) {
    return maxPoints;
  } else if (distance >= maxDistance) {
    return 0;
  } else {
    const t =
      (distance - acceptableDistance) / (maxDistance - acceptableDistance);
    console.log(t);
    return Math.round((1 - t) * maxPoints);
  }
};
