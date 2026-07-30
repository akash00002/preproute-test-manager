import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationControls({
  currentIndex,
  total,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-8 py-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex === 0}
        aria-label="Previous question"
        className="text-input-border transition-colors hover:text-preproute-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={currentIndex === total - 1}
        aria-label="Next question"
        className="text-input-border transition-colors hover:text-preproute-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
