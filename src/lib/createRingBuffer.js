/**
 * createRingBuffer
 * A fixed-size circular buffer (FIFO) for storing recent values in memory.
 *
 * @param {number} size - Max number of items to keep (default = 50)
 * @returns {Object} Ring buffer API with push, read, and clear methods
 */
export default function createRingBuffer(size = 50) {
	if (typeof size !== "number" || size <= 0) {
	  throw new Error("createRingBuffer: size must be a positive integer");
	}
  
	let idx = 0;
	const buf = new Array(size);
  
	return {
	  /**
	   * Add a new item to the buffer.
	   * Overwrites the oldest item when the buffer is full.
	   * @param {*} value
	   */
	  push(value) {
		if (typeof value === "undefined") return;
		buf[idx] = value;
		idx = (idx + 1) % size;
	  },
  
	  /**
	   * Returns a snapshot of buffered values in insertion order.
	   * Oldest to newest.
	   * @returns {Array}
	   */
	  read() {
		return [...buf.slice(idx), ...buf.slice(0, idx)].filter(v => typeof v !== "undefined");
	  },
  
	  /**
	   * Clear the buffer
	   */
	  clear() {
		buf.fill(undefined);
		idx = 0;
	  },
	};
  }
  