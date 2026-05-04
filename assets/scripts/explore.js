// explore.js

window.addEventListener('DOMContentLoaded', init);

const FACE_CLOSED = 'assets/images/smiling.png';
const FACE_OPEN   = 'assets/images/smiling-open.png';

function init() {
  const textArea    = document.getElementById('text-to-speak');
  const voiceSelect = document.getElementById('voice-select');
  const talkButton  = document.querySelector('#explore button');
  const faceImage   = document.querySelector('#explore > img');

  const synth = window.speechSynthesis;
  let voices = [];

  function populateVoices() {
    voices = synth.getVoices();
    voiceSelect.length = 1;
    voices.forEach((voice, i) => {
      const opt = document.createElement('option');
      opt.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
      opt.value = String(i);
      voiceSelect.appendChild(opt);
    });
  }

  populateVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.addEventListener('voiceschanged', populateVoices);
  }

  talkButton.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const idx = voiceSelect.value;
    if (idx !== 'select' && voices[idx]) {
      utterance.voice = voices[idx];
    }

    utterance.addEventListener('start', () => { faceImage.src = FACE_OPEN; });
    utterance.addEventListener('end',   () => {
      // only close the mouth once nothing else is queued/speaking
      if (!synth.speaking && !synth.pending) faceImage.src = FACE_CLOSED;
    });
    utterance.addEventListener('error', () => { faceImage.src = FACE_CLOSED; });

    // repeated clicks should restart, not queue
    synth.cancel();
    synth.speak(utterance);
  });
}
