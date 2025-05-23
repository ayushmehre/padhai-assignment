import React from "react";
import { Label, Slider, Switch } from "@/components/ui";
import { useSessionCtx } from "@/providers/SessionProvider";

export default function SettingsPanel({dark, setDark}) { 
  const { latency, setLatency } = useSessionCtx();

  return (
    <div className="flex items-center space-x-4 mb-4">
      <Switch checked={dark} onCheckedChange={() => setDark(!dark)} />
      <Label className="cursor-pointer">Dark Mode</Label>
      <div className="w-32">
        <Label className="space-y-20 mb-4 ml-4">Latency ({latency} ms)</Label>
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