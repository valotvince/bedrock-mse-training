import { getSegments, getMimeType, findSegment, findNearestCompleteSegment } from './utils/segments';
import { fetchSegment } from './utils/networking';
import { getBufferedRange } from './utils/buffer';

// This is a list of clear video segments
const videoSegments = getSegments('video');
const videoMimeType = getMimeType('video');
// This is a list of clear audio segments
const audioSegments = getSegments('audio');
const audioMimeType = getMimeType('audio');

// This videoTag element to be used
const videoTag = document.querySelector('video');
// MediaSource object to be used
const mediaSource = new MediaSource();

const getPlaybackPosition = () => videoTag.currentTime;

window.addEventListener('load', () => {
  console.log("This is a log just to confirm we've reached the load callback");

  videoTag.src = URL.createObjectURL(mediaSource);

  // More work to be done !
  // ...
});
