import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

type DurationOption =
  | "always"
  | "1week"
  | "2weeks"
  | "3weeks"
  | "1month"
  | "custom";

export interface PublishSettings {
  mode: "now" | "schedule";
  liveUntil: DurationOption;
  customEndDate?: string;
  customEndTime?: string;
}

interface PublishTestViewProps {
  onCancel: () => void;
  onConfirm: (settings: PublishSettings) => void;
}

const DURATION_OPTIONS: { value: DurationOption; label: string }[] = [
  { value: "always", label: "Always Available" },
  { value: "3weeks", label: "3 Weeks" },
  { value: "1week", label: "1 Week" },
  { value: "1month", label: "1 Month" },
  { value: "2weeks", label: "2 Weeks" },
  { value: "custom", label: "Custom Duration" },
];

export default function PublishTestView({
  onCancel,
  onConfirm,
}: PublishTestViewProps) {
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState<DurationOption>("custom");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  const handleConfirm = () => {
    onConfirm({
      mode: publishMode,
      liveUntil,
      customEndDate: liveUntil === "custom" ? customEndDate : undefined,
      customEndTime: liveUntil === "custom" ? customEndTime : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Publish mode tabs */}
      <div className="inline-flex w-fit rounded-lg bg-gray-50 p-1">
        <button
          onClick={() => setPublishMode("now")}
          className={`h-9 px-4 rounded-md text-sm font-medium transition-colors ${
            publishMode === "now"
              ? "bg-white text-primary-dark shadow-sm"
              : "text-input-placeholder"
          }`}
        >
          Publish Now
        </button>
        <button
          onClick={() => setPublishMode("schedule")}
          className={`h-9 px-4 rounded-md text-sm font-medium transition-colors ${
            publishMode === "schedule"
              ? "bg-white text-primary-dark shadow-sm"
              : "text-input-placeholder"
          }`}
        >
          Schedule Publish
        </button>
      </div>

      {/* Live until */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-text-gray">Live Until</h3>
        <p className="text-sm text-input-placeholder">
          Choose how long this test should remain available on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
        {DURATION_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2.5 cursor-pointer text-sm text-text-gray"
          >
            <input
              type="radio"
              name="live-until"
              checked={liveUntil === opt.value}
              onChange={() => setLiveUntil(opt.value)}
              className="h-4 w-4 accent-preproute-next"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {liveUntil === "custom" && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-input-border px-3 pr-10 text-sm text-text-gray placeholder:text-input-placeholder [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-input-placeholder" />
          </div>
          <div className="relative flex-1">
            <select
              value={customEndTime}
              onChange={(e) => setCustomEndTime(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-input-border px-3 pr-10 text-sm text-input-placeholder"
            >
              <option value="">Select End Time</option>
              {Array.from({ length: 24 }).flatMap((_, h) =>
                ["00", "30"].map((m) => {
                  const value = `${String(h).padStart(2, "0")}:${m}`;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                }),
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-input-placeholder" />
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-auto flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="h-11 px-6 rounded-lg bg-gray-50 text-sm font-medium text-primary-dark hover:opacity-80"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="h-11 px-6 rounded-lg bg-preproute-next text-sm font-medium text-gray-50 hover:opacity-90"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
