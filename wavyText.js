const defaultOptions = {
  whitespaceRatio: 1 / 4,
  fontSize: 100,
  tickRate: 5,
  wiggliness: 1,
};

export function getWavyText(textToDisplay, options = defaultOptions) {
  const { whitespaceRatio, fontSize, tickRate, wiggliness } = {
    ...defaultOptions,
    ...options,
  };
  const textBox = document.createElement("canvas");
  const ctx = textBox.getContext("2d");

  // figure out how big the canvas should be
  const { height, width } = getCanvasSize(
    textToDisplay,
    whitespaceRatio,
    fontSize
  );
  textBox.setAttribute("width", `${width}px`);
  textBox.setAttribute("height", `${height}px`);

  // draw the text on the canvas
  setFontAndStyling(ctx, fontSize);
  ctx.fillText(textToDisplay, width / 2, height / 2);

  // turn the text into rows of pixels
  const drawnText = ctx.getImageData(0, 0, width, height);
  const textImageByRows = [];
  for (let y = 0; y < drawnText.height; y++) {
    // grab the row of pixels
    const row = new ImageData(drawnText.width, 1); //ImageData(width, height)
    for (let x = 0; x < drawnText.width; x++) {
      const redIndex = y * (4 * drawnText.width) + x * 4;
      row.data[x * 4] = drawnText.data[redIndex];
      row.data[x * 4 + 1] = drawnText.data[redIndex + 1];
      row.data[x * 4 + 2] = drawnText.data[redIndex + 2];
      row.data[x * 4 + 3] = drawnText.data[redIndex + 3];
    }
    textImageByRows.push(row);
  }

  // shift the image
  let time = 0;
  setInterval(() => {
    ctx.clearRect(0, 0, width, height);

    textImageByRows.forEach((row, rowHeight) => {
      // calulate the delay
      const delay = rowHeight;
      let locationToDrawX = 0;
      if (time >= delay) {
        const maxTranslation =
          (width * whitespaceRatio) / (1 + 2 * whitespaceRatio);
        locationToDrawX =
          -maxTranslation * Math.sin(toRadians(wiggliness * (time - delay)));
      }
      ctx.putImageData(row, locationToDrawX, rowHeight);
    });
    time += 1;
  }, tickRate);

  return textBox;
}

function getCanvasSize(text, whitespaceRatio, fontSize) {
  const ctx = document.createElement("canvas").getContext("2d");
  setFontAndStyling(ctx, fontSize);
  const metrics = ctx.measureText(text);
  // We want the canvas to be wide enough to fit the text plus some whitespace on either
  // side for the animation to wave back and forth
  const width = metrics.width * (1 + 2 * whitespaceRatio);
  // use the fontBoundingBox instead of actualBoundingBoxAscent bc you can't set the text baseline to
  // the center of the actual text that's being displayed, only the center of the font
  const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  return { height, width };
}

function setFontAndStyling(canvasContext, fontSize) {
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.font = `${fontSize}px serif`;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
