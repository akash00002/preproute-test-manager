import { useRef, useEffect, useState, useCallback } from "react";
import {
  Italic,
  Bold,
  Underline,
  Link2,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Table2,
  Equal,
  ImagePlus,
  Sigma,
} from "lucide-react";
import deleteIcon from "../../assets/deleteGray-icon.svg";

interface ClearableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  clearLabel: string;
  className?: string;
}

// Icon color pinned to spec (#6B7180) instead of the generic text-text-gray class.
const toolbarButtonClass =
  "w-7 h-7 flex items-center justify-center rounded-md text-[#6B7180] " +
  "hover:bg-gray-100 active:scale-90 active:bg-gray-200 transition-transform duration-100 " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const activeButtonClass = "bg-gray-200 text-preproute-primary";

type FormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  insertUnorderedList: boolean;
};

const defaultFormatState: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  insertUnorderedList: false,
};

export default function ClearableTextarea({
  value,
  onChange,
  placeholder = "Type here",
  rows = 4,
  clearLabel,
  className = "",
}: ClearableTextareaProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formatState, setFormatState] =
    useState<FormatState>(defaultFormatState);

  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const syncFromDom = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const updateFormatState = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchorNode = sel.anchorNode;
    if (!anchorNode || !el.contains(anchorNode)) return;

    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateFormatState);
    return () =>
      document.removeEventListener("selectionchange", updateFormatState);
  }, [updateFormatState]);

  const exec = (command: string, val?: string) => {
    focusEditor();
    document.execCommand(command, false, val);
    syncFromDom();
    updateFormatState();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    exec("createLink", url);
  };

  const handleInsertFormula = () => {
    const formula = window.prompt("Enter formula (e.g. E = mc^2)");
    if (!formula) return;
    const escaped = formula
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    exec(
      "insertHTML",
      `<span style="font-family: ui-monospace, monospace; background:#F3F4F6; padding:2px 6px; border-radius:5px;">${escaped}</span>&nbsp;`,
    );
  };

  const handleInsertTable = () => {
    exec(
      "insertHTML",
      `<table style="border-collapse:collapse;margin:8px 0;"><tbody>
        <tr><td style="border:1px solid #97BCF0;padding:6px 10px;min-width:40px;">&nbsp;</td><td style="border:1px solid #97BCF0;padding:6px 10px;min-width:40px;">&nbsp;</td></tr>
        <tr><td style="border:1px solid #97BCF0;padding:6px 10px;">&nbsp;</td><td style="border:1px solid #97BCF0;padding:6px 10px;">&nbsp;</td></tr>
      </tbody></table><br/>`,
    );
  };

  const handleInsertDivider = () => {
    exec(
      "insertHTML",
      "<hr style='border:none;border-top:1px solid #97BCF0;margin:8px 0;' />",
    );
  };

  const handleToggleHighlight = () => {
    exec("hiliteColor", "#FEF3C7");
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      focusEditor();
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${dataUrl}" style="max-width:100%;border-radius:8px;margin:6px 0;" />`,
      );
      syncFromDom();
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const minHeight = `${rows * 24 + 24}px`;

  const btnClass = (active: boolean) =>
    `${toolbarButtonClass} ${active ? activeButtonClass : ""}`;

  return (
    <div
      className={`bg-white overflow-hidden focus-within:border-preproute-primary ${className}`}
      style={{
        width: "100%",
        height: 224,
        opacity: 1,
        transform: "rotate(0deg)",
        borderRadius: "var(--border-radius-c, 12px)",
        border: "0.5px solid #97BCF0",
      }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border border flex-wrap">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
          aria-label="Italic"
          aria-pressed={formatState.italic}
          className={btnClass(formatState.italic)}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
          aria-label="Bold"
          aria-pressed={formatState.bold}
          className={btnClass(formatState.bold)}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("underline")}
          aria-label="Underline"
          aria-pressed={formatState.underline}
          className={btnClass(formatState.underline)}
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertLink}
          aria-label="Insert link"
          className={toolbarButtonClass}
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleToggleHighlight}
          aria-label="Highlight text"
          className={toolbarButtonClass}
        >
          <Square size={16} fill="currentColor" />
        </button>

        <span className="w-px h-5 bg-input-border mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("justifyLeft")}
          aria-label="Align left"
          aria-pressed={formatState.justifyLeft}
          className={btnClass(formatState.justifyLeft)}
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("justifyCenter")}
          aria-label="Align center"
          aria-pressed={formatState.justifyCenter}
          className={btnClass(formatState.justifyCenter)}
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("justifyRight")}
          aria-label="Align right"
          aria-pressed={formatState.justifyRight}
          className={btnClass(formatState.justifyRight)}
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertUnorderedList")}
          aria-label="Bullet list"
          aria-pressed={formatState.insertUnorderedList}
          className={btnClass(formatState.insertUnorderedList)}
        >
          <List size={16} />
        </button>

        <span className="w-px h-5 bg-input-border mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertTable}
          aria-label="Insert table"
          className={toolbarButtonClass}
        >
          <Table2 size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertDivider}
          aria-label="Insert divider"
          className={toolbarButtonClass}
        >
          <Equal size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleImageButtonClick}
          aria-label="Insert image"
          className={toolbarButtonClass}
        >
          <ImagePlus size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertFormula}
          aria-label="Insert formula"
          className={toolbarButtonClass}
        >
          <Sigma size={16} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden text-text-color bg-white outline-none resize-none  text-sm text-text-gray placeholder:text-input-border placeholder:font-normal"
          onChange={handleImageSelected}
        />
      </div>

      {/* Editable area + clear button */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncFromDom}
          onKeyUp={updateFormatState}
          onMouseUp={updateFormatState}
          onFocus={updateFormatState}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="px-4 py-3 text-sm text-text-color outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-input-placeholder"
        />
        <button
          type="button"
          disabled={!value}
          onClick={() => {
            if (editorRef.current) editorRef.current.innerHTML = "";
            onChange("");
            setFormatState(defaultFormatState);
          }}
          aria-label={clearLabel}
          className="absolute top-3 right-3 text-input-border hover:text-red-500 active:scale-90 active:text-red-600 transition-transform duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src={deleteIcon} alt="" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
