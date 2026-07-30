import PlainClearableTextarea from "./PlainClearableTextarea";

interface SolutionEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SolutionEditor({
  value,
  onChange,
  className = "",
}: SolutionEditorProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="text-base font-medium text-text-gray">Add Solution</p>

      <PlainClearableTextarea
        value={value}
        onChange={onChange}
        rows={4}
        clearLabel="Clear solution"
        className="rounded-[12px] border border-border  focus:border-preproute-primary"
      />
    </div>
  );
}
