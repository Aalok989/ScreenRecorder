document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const recordedVideo = document.getElementById('recordedVideo');

  let mediaRecorder;
  let recordedChunks = [];
  let isRecording = false;

  const toggleBtn = document.getElementById('toggleBtn');
  toggleBtn.addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
        toggleBtn.textContent = 'Start Recording';
    } else {
        startRecording();
        toggleBtn.textContent = 'Stop Recording';
    }
    isRecording = !isRecording;
});

  async function startRecording() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'screen' }
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedVideo.src = URL.createObjectURL(recordedBlob);
      recordedVideo.controls = true;

      const a = document.createElement('a');
      a.href = recordedVideo.src;
      a.download = 'recorded-video.webm';
      document.body.appendChild(a);
      a.click();
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  function stopRecording() {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);
});
