import { useRef } from "react";
import createRingBuffer from "@/lib/createRingBuffer";

export default function useRingBuffer(size) {
	return useRef(createRingBuffer(size)).current;
}
