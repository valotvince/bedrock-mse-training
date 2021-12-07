import { getSegments, getMimeType, findSegment, findNearestCompleteSegment } from './utils/segments';
import { fetchSegment } from './utils/networking';
import { getBufferedRange } from './utils/buffer';
import { Segment } from './types';

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

class BufferManager {
  buffer: SourceBuffer;
  queue: Segment[] = [];
  mimeType: string;

  constructor(mediaSource: MediaSource, mimeType: string) {
    this.buffer = mediaSource.addSourceBuffer(mimeType);
    this.mimeType = mimeType;

    // Listen for when the buffer ends updating, and add the queued segments data
    this.buffer.addEventListener('updateend', this.onBufferUpdateEnd);
  }

  onBufferUpdateEnd = () => {
    if (this.buffer.updating) {
      return;
    }

    const segment = this.queue.shift();

    if (segment && segment.data) {
      this.buffer.appendBuffer(segment.data);
    }
  };

  async fetchAndQueueSegment(segment: Segment) {
    // Set data only if it hasn't been fetched already
    if (!segment.data) {
      segment.data = await fetchSegment(segment.url);
    }

    // If the buffer is currently appending buffer, we should queue the segment
    // and wait for the operation to finish before adding any more buffer.
    if (this.buffer.updating) {
      this.queue.push(segment);
    } else {
      this.buffer.appendBuffer(segment.data);
    }
  }

  async schedule(segments: Segment[]) {
    // Loop through the known videoSegments in order
    for (const segment of segments) {
      await this.fetchAndQueueSegment(segment);
    }
  }
}

async function onMediaSourceOpen() {
  // Create two buffers holding video and audio. MediaSource will handle the sync between them
  const videoBuffer = new BufferManager(mediaSource, videoMimeType);
  const audioBuffer = new BufferManager(mediaSource, audioMimeType);

  // Feed segments to both video and audio
  videoBuffer.schedule(videoSegments);
  audioBuffer.schedule(audioSegments);
}

window.addEventListener('load', () => {
  console.log("This is a log just to confirm we've reached the load callback");

  videoTag.src = URL.createObjectURL(mediaSource);

  // More work to be done !
  // ...
  mediaSource.addEventListener('sourceopen', onMediaSourceOpen);
});
