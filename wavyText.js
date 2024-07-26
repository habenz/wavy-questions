const defaultOptions = {
  whitespaceRatio: 1 / 4,
  fontSize: 100,
  tickRate: 5,
  wiggliness: 1,
};

export function getWavyText(textToDisplay, options = defaultOptions) {
  const canvas = document.createElement("canvas");

  let animationOptions = { ...defaultOptions, ...options };
  let animationHandle = drawAnimatedText(
    canvas,
    textToDisplay,
    animationOptions
  );

  const updateDrawing = (newText, update = {}) => {
    clearInterval(animationHandle);
    animationOptions = { ...animationOptions, ...update };
    animationHandle = drawAnimatedText(canvas, newText, animationOptions);
  };

  return { drawnText: canvas, updateDrawing };
}

function drawAnimatedText(canvas, textToDisplay, options) {
  // To do: maybe don't get the context mutliple times? does it matter??
  const ctx = canvas.getContext("2d");
  const { whitespaceRatio, fontSize, tickRate, wiggliness } = options;

  resizeCanvasForText(canvas, textToDisplay, whitespaceRatio, fontSize);

  // draw the text on the canvas
  setFontAndStyling(ctx, fontSize);
  ctx.fillText(textToDisplay, canvas.width / 2, canvas.height / 2);

  // animate the text
  return animatetext(canvas, whitespaceRatio, wiggliness, tickRate);
}

function resizeCanvasForText(canvas, text, whitespaceRatio, fontSize) {
  // figure out how big the canvas should be
  const ctx = canvas.getContext("2d");
  setFontAndStyling(ctx, fontSize);
  const metrics = ctx.measureText(text);
  // We want the canvas to be wide enough to fit the text plus some whitespace on either
  // side for the animation to wave back and forth
  const width = metrics.width * (1 + 2 * whitespaceRatio);
  // use the fontBoundingBox instead of actualBoundingBoxAscent bc you can't set the text baseline to
  // the center of the actual text that's being displayed, only the center of the font
  const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

  canvas.setAttribute("width", `${width}px`);
  canvas.setAttribute("height", `${height}px`);
}

function setFontAndStyling(canvasContext, fontSize) {
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.font = `${fontSize}px serif`;
}

function animatetext(canvas, whitespaceRatio, wiggliness, tickRate) {
  // Note: do you always get the same context when you call this function on the same
  // canvas element? What if you draw on the same canvas via two different contexts?
  // Why is it a function instaed of just a property?
  const ctx = canvas.getContext("2d");
  const drawnText = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const textImageByRows = getpixelsRowByRow(drawnText);

  // shift the image
  let time = 0;
  return setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    textImageByRows.forEach((row, rowHeight) => {
      const delay = rowHeight;
      let locationToDrawX = 0;
      if (time >= delay) {
        const maxTranslation =
          (canvas.width * whitespaceRatio) / (1 + 2 * whitespaceRatio);
        locationToDrawX =
          -maxTranslation * Math.sin(toRadians(wiggliness * (time - delay)));
      }
      ctx.putImageData(row, locationToDrawX, rowHeight);
    });
    time += 1;
  }, tickRate);
}

function getpixelsRowByRow(image) {
  const rows = [];
  for (let y = 0; y < image.height; y++) {
    // grab the row of pixels
    const row = new ImageData(image.width, 1); //ImageData(width, height)
    for (let x = 0; x < image.width; x++) {
      const redIndex = y * (4 * image.width) + x * 4;
      row.data[x * 4] = image.data[redIndex];
      row.data[x * 4 + 1] = image.data[redIndex + 1];
      row.data[x * 4 + 2] = image.data[redIndex + 2];
      row.data[x * 4 + 3] = image.data[redIndex + 3];
    }
    rows.push(row);
  }
  return rows;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
