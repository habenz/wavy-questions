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
drawnText = ctx.getImageData(0, 0, width, height);
let x = 0;
setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  setFontAndStyling(ctx);
  // .2*width is .333 of just the text width
  ctx.putImageData(drawnText, -0.2 * width * Math.sin(toRadians(x)), 0);
  x += 1;
}, 10);

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
