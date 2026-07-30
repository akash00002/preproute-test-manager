import arSticker from "../../assets/ar-sticker.svg";
import cognition from "../../assets/cognition.svg";
import pencil from "../../assets/pencil.svg";
import timer from "../../assets/timer.svg";
import quiz from "../../assets/quiz.svg";
import leaderboard from "../../assets/leaderboard.svg";

export type Difficulty = "easy" | "medium" | "hard";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Difficult",
};

interface TestInfoCardProps {
  typeLabel: string;
  subject?: string;
  topics: string[];
  subTopics: string[];
  totalTime?: number;
  totalMarks?: number;
  questionCount: number;
  difficulty?: Difficulty;
  onEdit: () => void;
}

export default function TestInfoCard({
  typeLabel,
  subject,
  topics,
  subTopics,
  totalTime,
  totalMarks,
  questionCount,
  difficulty,
  onEdit,
}: TestInfoCardProps) {
  const difficultyLabel = difficultyLabels[difficulty ?? "easy"];

  return (
    <div className="flex rounded-lg border border-border bg-white p-5 justify-between">
      <div className="flex flex-col h-47.5 gap-5">
        <span className="inline-flex items-center justify-center h-6 w-27.5 rounded-xl bg-primary-dark hover:bg-primary-hover text-white text-sm font-normal">
          {typeLabel}
        </span>

        <div className="flex h-6 items-center flex-wrap ">
          <img src={arSticker} alt="" className="w-6 h-6 mr-1.25" />
          <p className="font-bold text-base text-text-gray mr-2.5">Chapter 1</p>
          <div
            className="w-25 h-6 px-2.5 py-1 rounded-lg flex items-center justify-center gap-1.25 text-xs font-medium text-white"
            style={{ backgroundColor: "#2AB7A9" }}
          >
            <img src={cognition} alt="" className="h-4.5 w-4.5" />
            <span className="font-normal text-sm">{difficultyLabel}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.75 h-25.5">
          <div className="flex gap-2 items-center">
            <span className="w-25 text-sidebar-text font-normal text-xs">
              Subject
            </span>
            <span className="text-sidebar-text font-normal text-xs">:</span>
            <span className="font-medium text-base text-text-subtle">
              {subject ?? "—"}
            </span>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <span className="w-25 text-sidebar-text font-normal text-xs">
              Topic
            </span>
            <span className="text-sidebar-text font-normal text-xs">:</span>
            {topics.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1.25 h-6 rounded-lg border-[0.5px] border-accent-hover text-accent-primary text-sm flex items-center"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <span className="w-25 text-sidebar-text font-normal text-xs">
              Sub Topic
            </span>
            <span className="text-sidebar-text font-normal text-xs">:</span>
            {subTopics.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1.25 h-6 rounded-lg border-[0.5px] border-accent-hover text-accent-primary text-sm flex items-center"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-80.5 h-47.5 justify-between items-end">
        <button
          className="text-input-border hover:text-text-gray"
          aria-label="Edit test details"
          onClick={onEdit}
        >
          <img src={pencil} alt="" className="w-5 h-5" />
        </button>

        <div className="flex items-center h-8 w-80.5 px-1.25 gap-1.25 rounded-lg border justify-between border-border">
          <span className="flex h-8 w-20 items-center justify-center gap-1.5 text-sm font-normal text-text-gray">
            <img src={timer} alt="" className="w-4 h-4 opacity-60" />
            {totalTime ?? 60} Min
          </span>

          <span className="h-5 w-px bg-border" />

          <span className="flex h-8 w-25 items-center justify-center gap-1.5 text-sm font-normal text-text-gray">
            <img src={quiz} alt="" className="w-4 h-4 opacity-60" />
            {questionCount} Q's
          </span>

          <span className="h-5 w-px bg-border" />

          <span className="flex h-8 w-25 items-center justify-center gap-1.5 text-sm font-normal text-text-gray">
            <img src={leaderboard} alt="" className="w-4 h-4 opacity-60" />
            {totalMarks ?? 0} Marks
          </span>
        </div>
      </div>
    </div>
  );
}
