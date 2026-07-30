import ClearableTextarea from "./ClearableTextarea";

interface QuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function QuestionEditor({
  value,
  onChange,
  className = "",
}: QuestionEditorProps) {
  return (
    <div className={` overflow-hidden ${className}`}>
      <ClearableTextarea
        value={value}
        onChange={onChange}
        rows={5}
        clearLabel="Clear question text"
      />
    </div>
  );
}
