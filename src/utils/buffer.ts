/**
 * Search the appropriate TimeRange bound according to the given time.
 *
 * Reminder: The buffer buffered property appends a new time range at each
 * new segment added that doesn't match an existing timeRange
 *
 * We have a first buffer range from 0 to 8:
 *  Adding a segment starting at 15 (> 8) will add a new buffer range.
 *  Adding a segment starting at 8 will complete the existing buffer range.
 */
export const getBufferedRange = (timeRanges: TimeRanges, time: number) => {
  if (!timeRanges.length) {
    return null;
  }

  for (let i = 0; i < timeRanges.length; i++) {
    const start = timeRanges.start(i);
    const end = timeRanges.end(i);

    if (time >= start && time <= end) {
      return { start, end };
    }
  }

  return null;
};
