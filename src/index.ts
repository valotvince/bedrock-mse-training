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

async function onMediaSourceOpen() {
  const buffer = mediaSource.addSourceBuffer(videoMimeType);

  const segmentsData: ArrayBuffer[] = [];

  // Listen for when the buffer ends updating, and add the queued segments data
  buffer.addEventListener('updateend', () => {
    const data = segmentsData.shift();

    if (data) {
      buffer.appendBuffer(data);
    }
  });

  // Loop through the known videoSegments in order
  for (const segment of videoSegments) {
    const segmentData = await fetchSegment(segment.url);

    // If the buffer is currently appending buffer, we should queue the segment
    // and wait for the operation to finish before adding any more buffer.
    if (buffer.updating) {
      segmentsData.push(segmentData);
    } else {
      buffer.appendBuffer(segmentData);
    }
  }
}

window.addEventListener('load', () => {
  console.log("This is a log just to confirm we've reached the load callback");

  videoTag.src = URL.createObjectURL(mediaSource);

  // More work to be done !
  // ...
  mediaSource.addEventListener('sourceopen', onMediaSourceOpen);
});
