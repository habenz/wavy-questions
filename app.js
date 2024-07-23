import "./app.css";
import { getWavyText } from "./wavyText";
import controlsTemplate from "./controls.html";

// TODO: probbaly move this into its own file or something
new EventSource("/esbuild").addEventListener("change", () => location.reload());

const root = document.getElementById("wrapper");

let textToDisplay = "???";
let drawnText = getWavyText(textToDisplay);
root.append(drawnText);

const controls = document.createElement("div");
controls.innerHTML = controlsTemplate;
const button = controls.querySelector("#submitButton");

button.addEventListener("click", () => {
  textToDisplay = controls.querySelector("#textInput").value;
  drawnText.remove();
  drawnText = getWavyText(textToDisplay);
  root.prepend(drawnText);
});
root.append(controls);
