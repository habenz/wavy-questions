import "./app.css";
import { getWavyText } from "./wavyText";

// TODO: probbaly move this into its own file or something
new EventSource("/esbuild").addEventListener("change", () => location.reload());

const root = document.getElementById("wrapper");

let textToDisplay = "???";
let drawnText = getWavyText(textToDisplay);
root.append(drawnText);
