type CircleLeaderLineProps = {
    cx?: number;
    cy?: number;
    radius?: number;
    angleDeg: number;
    length?: number;
    horizontalLength?: number;
    stroke?: string;
    strokeWidth?: number;
    topText : string,
    bottomText : string
};

const CircleLeaderLine = ({cx = 180, cy = 180, radius = 180, angleDeg, length = 40, horizontalLength = 60, stroke = "#000", strokeWidth = 1.5, topText, bottomText} : CircleLeaderLineProps) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(angleRad);
    const y1 = cy + radius * Math.sin(angleRad);
    const x2 = x1 + length * Math.cos(angleRad);
    const y2 = y1 + length * Math.sin(angleRad);
    const direction = Math.cos(angleRad) >= 0 ? 1 : -1;
    const x3 = x2 + horizontalLength * direction;
    const y3 = y2;

    const textX = (x2 + x3) / 2;
    const textY = y2;
    return (
        <g>
            <path
                d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill="none"
            />
            {topText && (
                <text
                    x={textX}
                    y={textY - 8}
                    textAnchor="middle"
                    fontSize={24}
                    fontFamily={'Montserrat-medium'}
                    fontWeight={600}
                >
                    {topText}
                </text>
            )}
            {bottomText !== undefined && (
                <text
                    x={textX}
                    y={textY + 16}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#6B7280"
                >
                    {bottomText}
                </text>
            )}
        </g>
    );
};

export default CircleLeaderLine;