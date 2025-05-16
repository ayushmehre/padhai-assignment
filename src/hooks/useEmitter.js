import { useRef } from "react";
import mitt from "mitt";

export default function useEmitter() {
	return useRef(mitt()).current;
}
