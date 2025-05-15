/* createRingBuffer
   A fixed-size queue for buffering tutor events.
------------------------------------------------- */
export default function createRingBuffer(size = 50) {
	let idx = 0;
	const buf = new Array(size);

	return {
		/** push a value (overwrites oldest when full) */
		push(v) {
			buf[idx] = v;
			idx = (idx + 1) % size;
		},
		/** read out current contents in chronological order */
		read() {
			// Slice into two parts [idx..end] + [0..idx-1]
			return [...buf.slice(idx), ...buf.slice(0, idx)].filter(Boolean);
		},
		/** clear buffer */
		clear() {
			buf.fill(undefined);
			idx = 0;
		},
	};
}
