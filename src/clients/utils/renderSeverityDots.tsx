import CircleIcon from "@mui/icons-material/Circle";
import type { ReactNode } from "react";

/**
 * 유해성(Harmfulness)을 나타내는 점(Dot)을 렌더링합니다.
 * 점수가 높을수록 붉은색(위험), 낮을수록 초록색(안전)으로 표시됩니다.
 */
export const renderSeverityDots = (score: number): ReactNode[] => {
    const dots = [];
    const rounded = Math.round(score); // 명확한 전달을 위해 반올림하여 정수로 표현

    // 점수에 따른 색상 결정 (Traffic Light System)
    let color = "#4caf50"; // 기본: Green (Safe, 0~2점대)
    
    if (score >= 4.0) {
        color = "#d32f2f"; // Red (Danger, 4점 이상)
    } else if (score >= 2.5) {
        color = "#ed6c02"; // Orange (Warning, 2.5 ~ 3.9점)
    }

    for (let i = 1; i <= 5; i++) {
        if (rounded >= i) {
            // 채워진 점 (현재 위험도 색상 적용)
            dots.push(
                <CircleIcon 
                    key={i} 
                    sx={{ color: color, fontSize: 16, mr: 0.2 }} 
                />
            );
        } else {
            // 빈 점 (회색)
            dots.push(
                <CircleIcon 
                    key={i} 
                    sx={{ color: "#e0e0e0", fontSize: 16, mr: 0.2 }} 
                />
            );
        }
    }
    return dots;
};