import { swapFace } from "./swapFace.js";
import { cropCanvas, toBase64 } from "./utils.js";

let faceapi;
let img;
let detections;
const width = 900;
const height = 600;
let canvas, ctx;
let detectionBoxes = [];
let selectedBoxes = [];

// by default all options are set to true
const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

async function make() {
  img = new Image();
  img.src = "assets/people.jpeg";
  img.width = width;
  img.height = height;

  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");

  faceapi = await ml5.faceApi(detectionOptions, modelReady);
}
// call app.map.init() once the DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
  make();
});

function modelReady() {
  console.log("ready!");
  addClick();
  faceapi.detect(img, gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;
  ctx.drawImage(img, 0, 0, width, height);
  if (detections) {
    drawBoxes(detections, ctx);
  }
}

function drawBoxes(detections) {
  if (detections.length > 0) {
    detections.forEach((face) => {
      const aR = face.alignedRect._box;
      const faceBox = {
        x: aR._x,
        y: aR._y,
        w: aR._width,
        h: aR._height,
        wasClicked: false,
      };
      detectionBoxes.push(faceBox);

      let { _x, _y, _width, _height } = face.alignedRect._box;
      ctx.rect(_x, _y, _width, _height);
      ctx.strokeStyle = "#ff0000";
      ctx.stroke();
    });
  }
}

// listener, using W3C style for example
function addClick() {
  canvas.addEventListener(
    "click",
    (e) => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      detectionBoxes.forEach((box) => {
        ctx.beginPath();
        ctx.strokeStyle = "#00ff00";
        if (
          (e.offsetX > box.x &&
            e.offsetX < box.x + box.w &&
            e.offsetY > box.y &&
            e.offsetY < box.y + box.h) ||
          box.wasClicked
        ) {
          box.wasClicked = true;
          ctx.strokeStyle = "#00ff00";
          console.log("TOUCH BOX");
        } else {
          ctx.strokeStyle = "#ff0000";
        }
        ctx.rect(box.x, box.y, box.w, box.h);
        ctx.stroke();
        ctx.closePath();
      });
    },
    false
  );
}

function enableButton(myButton) {
  myButton.addEventListener(
    "click",
    () => {
      //create new array of selected faces
      detectionBoxes.forEach((box) => {
        if (box.wasClicked) {
          selectedBoxes.push(box);
        }
      });
      cropCanvas(canvas, selectedBoxes);
    },
    false
  );
}

// Helper Functions
function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);

  const myButton = document.createElement("button");
  myButton.innerText = "SUBMIT";
  myButton.className = "submitButton";
  document.body.appendChild(myButton);

  enableButton(myButton);
  return canvas;
}
