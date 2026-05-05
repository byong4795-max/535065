let video;
let faceMesh;
let faces = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 鏡頭啟動
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  console.log("Setup complete, video size:", video.width, video.height);

  // 人臉偵測
  faceMesh = ml5.facemesh(video, () => {
    console.log("FaceMesh ready");
  });

  faceMesh.on("predict", (results) => {
    faces = results;
  });
}

function draw() {
  background(0);

  let boxW = 640;
  let boxH = 480;
  let x = (width - boxW) / 2;
  let y = (height - boxH) / 2;

  // 顯示鏡頭
  if (video && video.elt && video.elt.readyState === video.elt.HAVE_ENOUGH_DATA) {
    image(video, x, y, boxW, boxH);
  }

  // 外框
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(x, y, boxW, boxH);

  // 中間偵測框
  let frameW = 300;
  let frameH = 300;
  let fx = width / 2 - frameW / 2;
  let fy = height / 2 - frameH / 2;

  stroke(0, 255, 150);
  strokeWeight(3);
  rect(fx, fy, frameW, frameH);

  // 畫臉
  drawFace(x, y, fx, fy, frameW, frameH);

  // 顯示狀態
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("Faces: " + faces.length, 20, 20);
}

function drawFace(offsetX, offsetY, fx, fy, fw, fh) {
  if (faces.length === 0) return;

  const face = faces[0];
  const keypoints = face.scaledMesh || [];
  const annotations = face.annotations || {};
  if (keypoints.length === 0) return;

  noFill();
  strokeWeight(2);

  // 臉型輪廓
  stroke(173, 255, 200);
  drawPath(annotations.silhouette || [], offsetX, offsetY, true);

  // 眼睛
  stroke(100, 255, 255);
  drawPath(annotations.leftEyeUpper0 || [], offsetX, offsetY, false);
  drawPath(annotations.leftEyeLower0 || [], offsetX, offsetY, false);
  drawPath(annotations.rightEyeUpper0 || [], offsetX, offsetY, false);
  drawPath(annotations.rightEyeLower0 || [], offsetX, offsetY, false);

  // 嘴唇
  stroke(255, 100, 200);
  drawPath(annotations.lipsUpperOuter || [], offsetX, offsetY, false);
  drawPath(annotations.lipsLowerOuter || [], offsetX, offsetY, false);

  // 鼻子
  stroke(100, 200, 255);
  drawPath(annotations.noseBridge || [], offsetX, offsetY, false);
}

function drawPath(points, offsetX, offsetY, closeShape) {
  if (!points || points.length === 0) return;
  beginShape();
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    vertex(x + offsetX, y + offsetY);
  }
  if (closeShape) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);

  let boxW = 640;
  let boxH = 480;

  let x = (width - boxW) / 2;
  let y = (height - boxH) / 2;

  // 👉 顯示鏡頭
  image(video, x, y, boxW, boxH);

  // 👉 畫中間偵測框（比鏡頭小一點）
  let frameW = 300;
  let frameH = 300;

  let fx = width / 2 - frameW / 2;
  let fy = height / 2 - frameH / 2;

  stroke(0, 255, 150);
  strokeWeight(3);
  noFill();
  rect(fx, fy, frameW, frameH);

  // 👉 畫臉（只有在框內才顯示）
  drawFace(x, y, fx, fy, frameW, frameH);

  // 外框（你的原本）
  stroke(255);
  strokeWeight(1);
  rect(x, y, boxW, boxH);

  // 文字
  fill(255);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text("414730050 曹苡萱", width / 2, y - 20);
}

function drawFace(offsetX, offsetY, fx, fy, fw, fh) {
  if (faces.length === 0) return;

  const face = faces[0];
  const keypoints = face.scaledMesh || [];
  const annotations = face.annotations || {};
  if (keypoints.length === 0) return;

  let centerX = 0;
  let centerY = 0;

  for (let i = 0; i < keypoints.length; i++) {
    centerX += keypoints[i][0];
    centerY += keypoints[i][1];
  }

  centerX /= keypoints.length;
  centerY /= keypoints.length;

  const screenX = centerX + offsetX;
  const screenY = centerY + offsetY;

  // 👉 判斷有沒有在框內
  if (
    screenX > fx &&
    screenX < fx + fw &&
    screenY > fy &&
    screenY < fy + fh
  ) {
    noFill();
    strokeWeight(2);

    stroke(173, 255, 200);
    drawPath(annotations.silhouette || keypoints.slice(0, 17), offsetX, offsetY, true);

    stroke(100, 255, 255);
    drawPath(annotations.leftEyeUpper0 || [], offsetX, offsetY, false);
    drawPath(annotations.leftEyeLower0 || [], offsetX, offsetY, false);
    drawPath(annotations.rightEyeUpper0 || [], offsetX, offsetY, false);
    drawPath(annotations.rightEyeLower0 || [], offsetX, offsetY, false);

    stroke(330, 255, 255);
    drawPath(annotations.lipsUpperOuter || [], offsetX, offsetY, false);
    drawPath(annotations.lipsLowerOuter || [], offsetX, offsetY, false);
    drawPath(annotations.lipsUpperInner || [], offsetX, offsetY, false);
    drawPath(annotations.lipsLowerInner || [], offsetX, offsetY, false);

    stroke(60, 255, 255);
    drawPath(annotations.noseBridge || [], offsetX, offsetY, false);
    drawPoints(annotations.noseTip || [], offsetX, offsetY);
  }
}

function drawPath(points, offsetX, offsetY, closeShape) {
  if (!points || points.length === 0) return;
  beginShape();
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    vertex(x + offsetX, y + offsetY);
  }
  if (closeShape) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

function drawPoints(points, offsetX, offsetY) {
  if (!points || points.length === 0) return;
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    circle(x + offsetX, y + offsetY, 6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}