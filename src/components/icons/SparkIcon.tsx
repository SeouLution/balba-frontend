import type { SVGProps } from "react";

type SparkIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * 발주바주 전용 반짝이 아이콘 (Figma: Icon/spark)
 * 색은 className으로 정해요. 예: <SparkIcon className="text-lime" />
 */
export function SparkIcon({ size = 24, ...props }: SparkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 1C13.267 7.067 16.933 10.733 23 12C16.933 13.267 13.267 16.933 12 23C10.733 16.933 7.067 13.267 1 12C7.067 10.733 10.733 7.067 12 1Z" />
    </svg>
  );
}
