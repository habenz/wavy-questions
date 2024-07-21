import "./app.css";

// TODO: probbaly move this into its own file or something
new EventSource("/esbuild").addEventListener("change", () => location.reload());

const toDisplay = "???";

const textBox = document.createElement("canvas");
const ctx = textBox.getContext("2d");

// figure out how big the canvas should be
const { height, width } = getCanvasSize(toDisplay);
textBox.setAttribute("width", `${width}px`);
textBox.setAttribute("height", `${height}px`);

// draw the stuff
setFontAndStyling(ctx);
ctx.fillText(toDisplay, width / 2, height / 2);
document.body.append(textBox);

// shift the image
const drawnText = ctx.getImageData(0, 0, width, height);
let time = 0;
setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  setFontAndStyling(ctx); // this line seems to be uneccessary

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

    // calulate the delay
    const delay = y;
    let locationToDrawX = 0;
    if (time >= delay) {
      // .2*width is .333 of just the text width
      locationToDrawX = -0.2 * width * Math.sin(toRadians(time - delay));
    }
    ctx.putImageData(row, locationToDrawX, y);
  }

  time += 1;
}, 5);

function getCanvasSize(text) {
  const ctx = document.createElement("canvas").getContext("2d");
  setFontAndStyling(ctx);
  const metrics = ctx.measureText(toDisplay);
  const width = metrics.width * 1.667;
  // use the font instead of actual bc you can't set the text baseline to
  // the center of the actual text that's being displayed, only the center of the font
  const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  return { height, width };
}

function setFontAndStyling(canvasContext) {
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.font = "100px serif";
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
