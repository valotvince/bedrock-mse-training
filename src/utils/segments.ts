const pathByType = {
  video: 'bbb_30fps_3840x2160_12000k',
  audio: 'bbb_a64k',
};

export const getSegments = (type: 'video' | 'audio') => {
  const prefix = pathByType[type];
  const segments: string[] = [];

  for (let segmentNumber = 0; segmentNumber <= 29; segmentNumber++) {
    segments.push(`https://dash.akamaized.net/akamai/bbb_30fps/${prefix}/${prefix}_${segmentNumber}`);
  }

  return segments;
};
