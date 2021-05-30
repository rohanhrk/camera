let videoElem = document.querySelector("video");
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click-image")
let isRecording = false;
let filterElem = document.querySelectorAll(".filter-color");
let filterColor = "";
let bgc = document.querySelectorAll(".bgc");
let timings = document.querySelector(".timer");
let counter = 0;
let clearObj;

// user  requirement send 
let constraint = {
    audio: true, video: true
}
// represent future recording
let recording = [];
let mediarecordingObjectForCurrStream;

// 1.1.1
// It returns a Promise that resolves to a MediaStream object.
//  If the user denies permission, or matching media is not available, 
// then the promise is rejected with NotAllowedError or NotFoundError respectively.
let usermediaPromise = navigator.mediaDevices.getUserMedia(constraint);

// /stream coming from required
usermediaPromise.
    then(function (stream) {
        // UI stream 
        videoElem.srcObject = stream;
        audioElem.srcObject = stream;

        // ================================================== Recording ==================================================
        // 1.2.1
        //browser 
        // Create a MediaRecorder object, specifying the source stream 
        mediarecordingObjectForCurrStream = new MediaRecorder(stream);

        // 1.2.2
        //camera recording add -> recording array
        // Set MediaRecorder.ondataavailable to an event handler for the dataavailable event;
        //  this will be called whenever data is available for you.
        mediarecordingObjectForCurrStream.ondataavailable = function (e) {
            recording.push(e.data);
        }

        // 1.2.4
        //download -> when mediarecordingObjectForCurrStream.stop() occur
        mediarecordingObjectForCurrStream.onstop = function () {
            //recording -> url covert
            //type MIME type
            const blob = new Blob(recording, { type: 'video/mp4' });
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = 'file.mp4';
            a.href = url;
            a.click();
            recording = [];
        }

    }).catch(function (err) {
        console.log(err);
        alert("please allow both microphone and camera");
    });

// 1.2.3
// Once the source media is playing and you've reached the point where you're ready to record video, 
// call MediaRecorder.start() to begin recording.
// You can stop recording at any time by calling MediaRecorder.stop().
recordBtn.addEventListener("click", function () {
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("first select the devices");
        return;
    }
    if (isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        recordBtn.innerText = "Recording...";
        startTimer();
    }
    else {
        stopTimer();
        mediarecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording;
})

//  ================================================== capture btn click ==================================================
captureImgBtn.addEventListener("click", function () {
    // ************ canvas create ************ 
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    // ************ draw image ************
    tool.drawImage(videoElem, 0, 0);
    
    // ************ ************
    if(filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0,0,canvas.width, canvas.height);
    }

    // ************ Download logic ************
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
})

// ================================================== Filter change ==================================================
for (let i = 0; i < filterElem.length; i++) {
    filterElem[i].addEventListener("click", function () {
        filterColor = filterElem[i].classList[2];
        bgc[0].style.backgroundColor = filterColor;
        bgc[0].style.opacity = "20%"
    })
}

// ================================================== Timer ==================================================
function startTimer() {
    timings.style.display = "flex";
    function fn() {
        // hours
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;

        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        
        timings.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }
    clearObj = setInterval(fn, 1000);
}
function stopTimer() {
    timings.style.display = "none";
    clearInterval(clearObj);
}