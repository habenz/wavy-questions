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
controls.setAttribute("id", "controls");
controls.innerHTML = controlsTemplate;

const textInput = controls.querySelector("#textInput");
textInput.value = textToDisplay;

const inputs = [
  {
    id: "whitespace-ratio",
    type: "number",
    label: "whitespace ratio",
    description: "fraction of the width, default .25",
  },
  {
    id: "font-size",
    type: "number",
    label: "font size",
    description: "default 100px",
  },
  {
    id: "tick-rate",
    type: "number",
    label: "tick-rate",
    description: "animation cadence, default 5ms",
  },
  {
    id: "wiggliness",
    type: "number",
    label: "wiggliness",
    description: "wave frquency, default 1",
  },
];

inputs.forEach(({ label, type, id, description }) => {
  // make a label
  controls.insertAdjacentHTML("beforeend", `<span>${label}</span>`);
  // make the input element
  const knob = document.createElement("input");
  Object.assign(knob, {
    type,
    value: "",
    id,
    placeholder: description,
  });
  controls.append(knob);
});

const button = controls.querySelector("#submitButton");

button.addEventListener("click", () => {
  drawnText.remove();

  textToDisplay = controls.querySelector("#textInput").value;

  const animationOptions = {};
  controls.querySelectorAll('input[type="number"]').forEach((input) => {
    if (input.value) {
      animationOptions[kebabToCamelCase(input.id)] = input.value;
    }
  });

  drawnText = getWavyText(textToDisplay, animationOptions);
  root.prepend(drawnText);
});

root.append(controls);

function kebabToCamelCase(htmlId) {
  return htmlId
    .split("-")
    .map((word, i) => {
      if (i == 0) {
        return word;
      }
      return word[0].toUpperCase() + word.slice(1);
    })
    .join("");
}
