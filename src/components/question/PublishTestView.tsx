import { useState, useRef } from "react";
import Calendar from "../../assets/calendar.svg";
import ChevronIcon from "../../assets/chevron-icon.svg";

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
  scheduleDate?: string;
  scheduleTime?: string;
}

interface PublishTestViewProps {
  onCancel: () => void;
  onConfirm: (settings: PublishSettings) => void;
  isSubmitting?: boolean;
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
  isSubmitting = false,
}: PublishTestViewProps) {
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [liveUntil, setLiveUntil] = useState<DurationOption>("custom");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  // Schedule Publish — date & time the test should go live
  const [scheduleDateType, setScheduleDateType] = useState<"text" | "date">(
    "text",
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);
  const scheduleDateInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    onConfirm({
      mode: publishMode,
      liveUntil,
      customEndDate: liveUntil === "custom" ? customEndDate : undefined,
      customEndTime: liveUntil === "custom" ? customEndTime : undefined,
      scheduleDate: publishMode === "schedule" ? scheduleDate : undefined,
      scheduleTime: publishMode === "schedule" ? scheduleTime : undefined,
    });
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setDateType("date");

    requestAnimationFrame(() => {
      dateInputRef.current?.focus();
      dateInputRef.current?.showPicker?.();
    });
  };

  const handleScheduleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setScheduleDateType("date");

    requestAnimationFrame(() => {
      scheduleDateInputRef.current?.focus();
      scheduleDateInputRef.current?.showPicker?.();
    });
  };

  return (
    <div className="flex flex-col gap-7.5">
      {/* Publish mode tabs */}
      <div className="inline-flex gap-5 w-72 rounded-lg bg-white py-0.5 px-2.5 border border-border">
        <button
          onClick={() => setPublishMode("now")}
          className={`h-10 px-2.75 py-0.75 rounded-lg text-sm  transition-colors ${
            publishMode === "now"
              ? "bg-brand-semiWhite text-primary-hover shadow-sm font-bold"
              : "text-input-border font-normal"
          }`}
        >
          Publish Now
        </button>
        <button
          onClick={() => setPublishMode("schedule")}
          className={`h-10 px-2.75 py-0.75 rounded-lg text-sm  transition-colors ${
            publishMode === "schedule"
              ? "bg-brand-semiWhite text-primary-hover shadow-sm font-bold"
              : "text-input-border font-normal"
          }`}
        >
          Schedule Publish
        </button>
      </div>

      {/* Select Date and Time — only for Schedule Publish */}
      {publishMode === "schedule" && (
        <div className="flex flex-col gap-3.75">
          <h3 className="text-base font-bold text-text-gray">
            Select Date and Time
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 rounded-lg border-[0.5px] border-input-border transition-colors focus-within:border-preproute-next focus-within:ring-preproute-next">
              <input
                ref={scheduleDateInputRef}
                type={scheduleDateType}
                placeholder="Select Date"
                value={scheduleDate}
                onFocus={() => setScheduleDateType("date")}
                onBlur={() => {
                  if (!scheduleDate) setScheduleDateType("text");
                }}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="h-11 w-full rounded-lg border-0 bg-transparent px-3 pr-10 text-sm text-text-gray placeholder:text-border-medium focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0"
              />

              <img
                src={Calendar}
                alt="Calendar"
                onClick={handleScheduleCalendarClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
              />
            </div>

            <div className="relative flex-1 rounded-lg border-[0.5px] border-input-border transition-colors focus-within:border-preproute-next focus-within:ring-preproute-next">
              <select
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border-0 bg-transparent px-3 pr-10 text-sm text-input-placeholder focus:outline-none focus:ring-0"
              >
                <option value="">Select Time</option>
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

              <img
                src={ChevronIcon}
                alt=""
                className="pointer-events-none absolute rotate-180 right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-input-placeholder"
              />
            </div>
          </div>
        </div>
      )}

      {/* Live until */}
      <div className="flex flex-col gap-3.75">
        <h3 className="text-base font-bold text-text-gray">Live Until</h3>
        <p className="text-base font-normal text-sidebar-text">
          Choose how long this test should remain available on the platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 py-4">
          {DURATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3.75 cursor-pointer"
            >
              <input
                type="radio"
                name="live-until"
                checked={liveUntil === opt.value}
                onChange={() => setLiveUntil(opt.value)}
                className="sr-only"
              />

              <span
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  liveUntil === opt.value
                    ? "border-preproute-next"
                    : "border-blue-300"
                }`}
              >
                {liveUntil === opt.value && (
                  <span className="w-2.5 h-2.5 rounded-full bg-preproute-next" />
                )}
              </span>

              <span className="text-sm font-normal text-text-gray">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {liveUntil === "custom" && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div
            className={`relative flex-1 rounded-lg border-[0.5px] border-input-border transition-colors focus-within:border-preproute-next focus-within:ring-preproute-next`}
          >
            <input
              ref={dateInputRef}
              type={dateType}
              placeholder="Select End Date"
              value={customEndDate}
              onFocus={() => setDateType("date")}
              onBlur={() => {
                if (!customEndDate) setDateType("text");
              }}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-transparent px-3 pr-10 text-sm text-text-gray placeholder:text-border-medium focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />

            <img
              src={Calendar}
              alt="Calendar"
              onClick={handleCalendarClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
            />
          </div>
          <div className="relative flex-1 rounded-lg border-[0.5px] border-input-border transition-colors focus-within:border-preproute-next focus-within:ring-preproute-next">
            <select
              value={customEndTime}
              onChange={(e) => setCustomEndTime(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border-0 bg-transparent px-3 pr-10 text-sm text-input-placeholder focus:outline-none focus:ring-0"
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

            <img
              src={ChevronIcon}
              alt=""
              className="pointer-events-none absolute rotate-180 right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-input-placeholder"
            />
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-auto flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 px-6 rounded-lg bg-gray-50 text-sm font-medium text-primary-dark hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="h-11 px-6 rounded-lg bg-preproute-next text-sm font-medium text-gray-50 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {isSubmitting ? "Publishing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
