import { getSegments } from './utils/segments';
import { fetchSegment } from './utils/networking';

/**
 * REFERENCES
 *
 * window.MediaSource
 * window.SourceBuffer
 */

const loadVideo = (videoTag: HTMLVideoElement) => {
  console.log("This is a log just to confirm we've reached the loadVideo callback");

  // This is a list of clear video segments
  const videoSegments = getSegments('video');

  // Work to be done !
};

window.addEventListener('load', () => {
  loadVideo(document.querySelector('video'));
});
