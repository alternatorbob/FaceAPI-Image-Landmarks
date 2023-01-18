import { swapFace } from "./swapFace.js";

export const cropCanvas = (sourceCanvas, detections) => {
  detections.forEach((detection) => {
    const x = detection.x;
    const y = detection.y;
    const width = detection.w;
    const height = detection.h;
    let destCanvas = document.createElement("canvas");
    document.body.appendChild(destCanvas);
    destCanvas.width = width;
    destCanvas.height = height;
    //   ctx.fillStyle = "#000000";
    //   ctx.fillRect(0, 0, width, height);

    destCanvas.getContext("2d").drawImage(
      sourceCanvas,
      x,
      y,
      width,
      height, // source rect with content to crop
      0,
      0,
      width,
      height
    ); // newCanvas, same size as source rect

    swapFace(toBase64(destCanvas));
    return destCanvas;
  });
};

export const createCanvas = (srcImg) => {
  let width, height;
  let myCanvas = document.createElement("canvas");
  let ctx = myCanvas.getContext("2d");

  var i = new Image();

  i.onload = () => {
    console.log(i.width + ", " + i.height);
    width = i.width;
    height = i.height;
    myCanvas.width = width;
    myCanvas.height = height;

    ctx.drawImage(i, 0, 0);
    document.body.appendChild(myCanvas);
  };

  i.src = srcImg;
};

const getBase64StringFromDataURL = (dataURL) =>
  dataURL.replace("data:", "").replace(/^.+,/, "");

export const toBase64 = (source) => {
  const dataURL = source.toDataURL();
  return dataURL;
  // Logs data:image/png;base64,wL2dvYWwgbW9yZ...
  // Convert to Base64 string
  // const base64 = getBase64StringFromDataURL(dataURL);
  // return base64;
};

export function toDataURL(url) {
  let xhRequest = new XMLHttpRequest();
  xhRequest.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      // console.log(reader.result);
      //   callback(reader.result);
    };
    reader.readAsDataURL(xhRequest.response);
  };
  xhRequest.open("GET", url);
  xhRequest.responseType = "blob";
  xhRequest.send();
}

let convertedImages = [
  toDataURL("./assets/frida_crop.png"),
  toDataURL("./assets/rando_face.jpeg"),
];
