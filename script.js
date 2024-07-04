let data = { id: 632663, points: [] };
const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
const recordBtn = document.getElementById("recordBtn");
const drawAgainBoard = document.getElementById("drawAgainBoard");
const drCtx = drawAgainBoard.getContext('2d');
const reDrawBtn = document.getElementById("reDrawBtn");
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
const cursorDiv = document.getElementById("cursorDiv");

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = (window.innerHeight - canvasOffsetY) / 2;

drawAgainBoard.width = window.innerWidth;
drawAgainBoard.height = window.innerHeight;


reDrawBtn.addEventListener("click", reDraw);

let isRecording = false;
function handleRec(ev) {
    if (!isRecording) {
        recordBtn.classList.remove("fa-play");
        recordBtn.classList.add("fa-pause");
        isRecording = true;
        startRec(ev);
    } else {
        recordBtn.classList.remove("fa-pause");
        recordBtn.classList.add("fa-play");
        isRecording = false;
        console.log(data);
        stopRec();
    }
}

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }

});

const draw = (e) => {

    if (!isPainting) {
        return;
    }

    // let databit = {time}

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);


recordBtn.addEventListener("click", handleRec);

let recorder;
function startRec(ev) {
    data.points = [];
    let time = new Date().getTime();
    let e = ev;
    document.addEventListener("mousemove", function (ev) { e = ev; });
    recorder = setInterval(() => {
        let crrTime = new Date().getTime() - time;
        let dataBit = { x: e.clientX - canvasOffsetX, y: e.clientY, "time": crrTime, isDraw: isPainting };
        data.points.push(dataBit);
    }, 25)
}

function stopRec() {
    document.removeEventListener("mousemove", function (ev) { e = ev; });
    clearInterval(recorder);
}


function reDraw() {
    if (data.points.length <= 4) {
        alert("No recording found");
        return
    }
    let allPointsData = data.points;
    allPointsData.forEach((obj) => {
        if (obj.isDraw) {
            setTimeout(function () {
                console.log(obj);
                drCtx.lineWidth = 5;
                drCtx.lineCap = 'round';
                drCtx.lineTo(obj.x+canvasOffsetX, obj.y);
                drCtx.stroke();
            }, obj.time)
        }
        else {
            setTimeout(function () {
                drCtx.beginPath();
            }, obj.time)
        }
        setTimeout(function () {
            cursorDiv.style.left = obj.x+canvasOffsetX;
            cursorDiv.style.top = obj.y;
        }, obj.time-100)
    });
    drCtx.beginPath();
}
function dr() {
    drCtx.beginPath();

    // Set a start-point
    drCtx.moveTo(0, 0);

    // Set an end-point
    drCtx.lineTo(200, 100);

    // Stroke it (Do the Drawing)
    drCtx.stroke();
    console.log("spe");

    ctx.beginPath();

    // Set a start-point
    ctx.moveTo(0, 0);

    // Set an end-point
    ctx.lineTo(200, 100);

    // Stroke it (Do the Drawing)
    ctx.stroke();
}
// dr();
