let video = document.querySelector("video")
let recordBtnContainer = document.querySelector(".record-btn-container")
let captureBtnContainer = document.querySelector(".capture-btn-container")
let recordBtn = document.querySelector(".record-btn")
let captureBtn = document.querySelector(".capture-btn")
let recordFlag = false

let constraints = { audio: true, video: true }
let recorder;
let chunks = []

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream
        recorder = new MediaRecorder(stream)
        recorder.addEventListener("start", (e) => {
            chunks = []
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data)
        })

        recorder.addEventListener("stop", (e) => {
            let blob = new Blob(chunks, { type: "video/mp4" })
            let videoUrl = URL.createObjectURL(blob)
            let a = document.createElement("a")
            a.href = videoUrl
            a.download = 'stream.mp4'
            a.click()
        })

        recordBtnContainer.addEventListener("click", (e) => {
            if (!recorder) return

            recordFlag = !recordFlag

            if (recordFlag) {
                recorder.start()
                recordBtn.classList.add("scale-record")
                startTimer()
            }

            else {
                recorder.stop()
                recordBtn.classList.remove('scale-record')
                stopTimer()
            }
        })
    })
    .catch((error) => {
        console.log(error)
        let p = document.querySelector(".error-msg")
        p.textContent = "Camera access denied! Refresh the page and allow camera permissions to continue recording."
    })

captureBtnContainer.addEventListener("click", (e) => {
    captureBtnContainer.classList.add('scale-capture')
    let canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    let imageURL = canvas.toDataURL("image/jpeg");

    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture")
    }, 500)
})

let filter = document.querySelector(".filter-layer");

let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
});




let timer = document.querySelector(".timer")
let counter = 0
let timerID;
const startTimer = () => {
    timer.style.display = "block"
    let displayTimer = () => {
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
}

const stopTimer = () => {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}