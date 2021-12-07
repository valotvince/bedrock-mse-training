import { Segment } from '../types';

const prefixByType = {
  video: 'bbb_30fps_1024x576_2500k',
  audio: 'bbb_a64k',
};

const suffixByType = {
  video: 'm4v',
  audio: 'm4a',
};

const durationByType = {
  video: 3.999999,
  audio: 4.010666,
};

// Little hack since segments could be slightly less big than advertised into
// manifests. This should be better handled if we were to build a real player :)
export const findSegment = (segments: Segment[], startTime: number) =>
  segments.find(({ start }) => start >= startTime - 0.001);

export const findNearestCompleteSegment = (segments: Segment[], startTime: number) =>
  segments.find(({ start: segmentStart, end: segmentEnd }) => segmentStart <= startTime && segmentEnd >= startTime);

export const getMimeType = (type: 'video' | 'audio') => {
  if (type === 'video') {
    return 'video/mp4; codecs="avc1.64001f"';
  }

  return 'audio/mp4; codecs="mp4a.40.5"';
};

export const getSegments = (type: 'video' | 'audio') => {
  const prefix = prefixByType[type];
  const suffix = suffixByType[type];
  const duration = durationByType[type];

  const segments: Segment[] = [];

  // Init segment
  segments.push({
    id: 0,
    duration: 0,
    start: 0,
    end: 0,
    url: `https://dash.akamaized.net/akamai/bbb_30fps/${prefix}/${prefix}_0.${suffix}`,
  });

  for (let segmentNumber = 0; segmentNumber <= 60; segmentNumber++) {
    segments.push({
      id: segmentNumber + 1,
      duration,
      start: segmentNumber * duration,
      end: duration + segmentNumber * duration,
      url: `https://dash.akamaized.net/akamai/bbb_30fps/${prefix}/${prefix}_${segmentNumber + 1}.${suffix}`,
    });
  }

  return segments;
};
