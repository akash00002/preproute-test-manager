import FormSelect from "../form/FormSelect";

const difficultyOptions = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Difficult" },
];

interface QuestionSettingsGridProps {
  difficulty: string;
  topic: string;
  subTopic: string;
  topics: { id: string; name: string }[];
  subTopics: { id: string; name: string }[];
  onDifficultyChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSubTopicChange: (value: string) => void;
}

export default function QuestionSettingsGrid({
  difficulty,
  topic,
  subTopic,
  topics,
  subTopics,
  onDifficultyChange,
  onTopicChange,
  onSubTopicChange,
}: QuestionSettingsGridProps) {
  return (
    <div className="flex flex-col gap-[30px]">
      <p className="text-base font-medium text-text-gray">Question settings</p>

      <div className="flex flex-col grid-cols-1 md:grid-cols-3 gap-5">
        <FormSelect
          label="Level of Difficulty"
          options={difficultyOptions}
          currentValue={difficulty}
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          placeholder="Select from Drop-down"
        />

        <FormSelect
          label="Topic"
          options={topics}
          currentValue={topic}
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Select from Drop-down"
        />

        <FormSelect
          label="Sub-topic"
          options={subTopics}
          currentValue={subTopic}
          value={subTopic}
          onChange={(e) => onSubTopicChange(e.target.value)}
          placeholder="Select from Drop-down"
        />
      </div>
    </div>
  );
}
