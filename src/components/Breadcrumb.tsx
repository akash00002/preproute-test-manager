import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showActionButton?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
  showBottomBorder?: boolean;
  className?: string;
}

export default function Breadcrumb({
  items,
  showActionButton = false,
  actionLabel = "Publish",
  onActionClick,
  showBottomBorder = false,
  className = "",
}: BreadcrumbProps) {
  return (
    <div
      className={`h-18 px-5 flex items-center justify-between gap-4 ${
        showBottomBorder ? "border-b-[0.5px] border-border" : ""
      } ${className}`}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap text-base font-medium text-black/60 leading-[150%]"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center">
              {item.to ? (
                <Link
                  to={item.to}
                  className="hover:text-black hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}

              {!isLast && <span className="mx-2">/</span>}
            </div>
          );
        })}
      </nav>

      {showActionButton && (
        <button
          type="button"
          onClick={onActionClick}
          className="w-50 h-12 rounded-pill bg-preproute-next text-white font-medium text-base hover:opacity-90 transition-opacity shrink-0 hover:cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
