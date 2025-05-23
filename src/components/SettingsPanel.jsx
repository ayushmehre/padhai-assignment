import React from "react";
import { Label, Slider, Switch } from "@/components/ui";
import { useSessionCtx } from "@/providers/SessionProvider";

export default function SettingsPanel({ dark, setDark }) {
  const { latency, setLatency } = useSessionCtx();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch checked={dark} onCheckedChange={() => setDark(!dark)} />
        <Label className="cursor-pointer">Dark Mode</Label>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="mb-1">Latency ({latency} ms)</Label>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={[latency]}
          onValueChange={(v) => setLatency(v[0])}
        />
      </div>
    </div>
  );
}
