export function AuthLogo() {
  return (
    <svg
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-auto"
      aria-hidden="true"
    >
      {/* Left page */}
      <path
        d="M20 4C20 4 12 2 4 4V24C12 22 20 24 20 24"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M20 4C20 4 28 2 36 4V24C28 22 20 24 20 24"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <line
        x1="20"
        y1="4"
        x2="20"
        y2="24"
        stroke="#b45309"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Left text lines */}
      <line
        x1="8"
        y1="10"
        x2="17"
        y2="10"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="8"
        y1="14"
        x2="17"
        y2="14"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="8"
        y1="18"
        x2="14"
        y2="18"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Right text lines */}
      <line
        x1="23"
        y1="10"
        x2="32"
        y2="10"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="23"
        y1="14"
        x2="32"
        y2="14"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="23"
        y1="18"
        x2="29"
        y2="18"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
