import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Sigma,
} from "lucide-react";

export default function RichTextToolbar() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-input-border text-input-border overflow-x-auto">
      <Italic size={16} />
      <Bold size={16} />
      <Underline size={16} />
      <Strikethrough size={16} />
      <Link2 size={16} />
      <span className="w-px h-4 bg-input-border shrink-0" />
      <AlignLeft size={16} />
      <AlignCenter size={16} />
      <AlignRight size={16} />
      <AlignJustify size={16} />
      <ImageIcon size={16} />
      <Sigma size={16} />
    </div>
  );
}
