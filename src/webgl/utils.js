function getRectBuffer(x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]
}

function getRandom256x() {
  return (Math.random()) * 256 >> 0;
}

function getRandom2x() {
  return (Math.random() * 2 - 1) * 255 >> 0;
}

export {
  getRectBuffer,
  getRandom2x,
  getRandom256x,
}
