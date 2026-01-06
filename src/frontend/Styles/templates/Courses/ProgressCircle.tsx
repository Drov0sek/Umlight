type ProgressCircleProps = {
    percent: number;
    sign : string;
    size?: number;
    strokeWidth?: number;
};

const ProgressCircle = ({percent, size = 200, strokeWidth = 12, sign}: ProgressCircleProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    return (
        <svg width={size} height={size}>
            {/* Фон */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
            />

            {/* Прогресс */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#4F46E5"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />

            {/* Текст */}
            <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={48 + 48 * (size / 200 - 1)}
                fontWeight="600"
                fontFamily={"Montserrat-bold"}
            >
                {percent}%
            </text>

            <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13 + 13 * (size / 200 - 1)}
                fill="#6B7280"
                fontFamily={"Montserrat-Regular"}
            >
                {sign}
            </text>
        </svg>
    );
};

export default ProgressCircle;
