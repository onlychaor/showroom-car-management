export default function SemiDonut({ value = 42 }: { value?: number }) {
  // simple SVG semi-donut visual; value between 0-100
  const radius = 80
  const stroke = 16
  const normalized = Math.max(0, Math.min(100, value))
  const circumference = Math.PI * radius
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="flex items-center justify-center">
      <svg width={radius * 2 + 20} height={radius + 40} viewBox={`0 0 ${radius * 2 + 20} ${radius + 40}`}>
        <g transform={`translate(${10},${radius + 10})`}>
          <path
            d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`}
            fill="none"
            stroke="#000"
            strokeWidth={stroke}
            strokeLinecap="round"
            opacity={0.08}
          />
          <path
            d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`}
            fill="none"
            stroke="url(#grad1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={offset}
          />
        </g>
        <defs>
          <linearGradient id="grad1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd9b3" />
            <stop offset="60%" stopColor="#ffb27a" />
            <stop offset="100%" stopColor="#ff7a00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

