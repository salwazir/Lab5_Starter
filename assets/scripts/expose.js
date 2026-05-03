// expose.js

window.addEventListener('DOMContentLoaded', init);

const HORNS = {
  'air-horn':   { img: 'assets/images/air-horn.svg',   audio: 'assets/audio/air-horn.mp3',   label: 'Air horn'   },
  'car-horn':   { img: 'assets/images/car-horn.svg',   audio: 'assets/audio/car-horn.mp3',   label: 'Car horn'   },
  'party-horn': { img: 'assets/images/party-horn.svg', audio: 'assets/audio/party-horn.mp3', label: 'Party horn' },
};

function volumeIconFor(value) {
  if (value <= 0)  return { src: 'assets/icons/volume-level-0.svg', alt: 'Volume level 0' };
  if (value < 33)  return { src: 'assets/icons/volume-level-1.svg', alt: 'Volume level 1' };
  if (value < 67)  return { src: 'assets/icons/volume-level-2.svg', alt: 'Volume level 2' };
  return { src: 'assets/icons/volume-level-3.svg', alt: 'Volume level 3' };
}

function init() {
  const hornSelect   = document.getElementById('horn-select');
  const hornImage    = document.querySelector('#expose > img');
  const audio        = document.querySelector('audio');
  const volumeSlider = document.getElementById('volume');
  const volumeIcon   = document.querySelector('#volume-controls img');
  const playButton   = document.querySelector('#expose button');

  const jsConfetti = new JSConfetti();

  hornSelect.addEventListener('change', () => {
    const horn = HORNS[hornSelect.value];
    if (!horn) return;
    hornImage.src = horn.img;
    hornImage.alt = horn.label;
    audio.src     = horn.audio;
  });

  volumeSlider.addEventListener('input', () => {
    const v = Number(volumeSlider.value);
    audio.volume = v / 100;
    const { src, alt } = volumeIconFor(v);
    volumeIcon.src = src;
    volumeIcon.alt = alt;
  });

  playButton.addEventListener('click', () => {
    if (!audio.src) return;
    audio.play();
    if (hornSelect.value === 'party-horn') {
      jsConfetti.addConfetti();
    }
  });
}
