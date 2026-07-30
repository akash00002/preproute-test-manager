/* eslint-disable react-refresh/only-export-components */
export type TestTab = "chapterwise" | "pyq" | "mock";

export const testTabs: { key: TestTab; label: string }[] = [
  { key: "chapterwise", label: "Chapter Wise" },
  { key: "pyq", label: "PYQ" },
  { key: "mock", label: "Mock Test" },
];

export const isValidTestTab = (value: string | undefined): value is TestTab =>
  testTabs.some((tab) => tab.key === value);

interface TestTypeTabsProps {
  activeTab: TestTab;
  onChange: (tab: TestTab) => void;
}

export default function TestTypeTabs({
  activeTab,
  onChange,
}: TestTypeTabsProps) {
  return (
    <div className="w-85 h-12.5 px-2.5 py-0.5 flex items-center gap-7.5 border-[0.5px] border-input-placeholder rounded-xl">
      {testTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`h-10 px-2.75 py-0.75 gap-1.5 rounded-pill text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-brand-semiWhite text-sidebar-active"
              : "text-input-border"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
