import "./app.css";
import { drawWavyText } from "./wavyText";

// TODO: probbaly move this into its own file or something
new EventSource("/esbuild").addEventListener("change", () => location.reload());

const toDisplay = "???";
drawWavyText(toDisplay);
