import { useDashboard, type ThemeColors } from "../../../Providers/DashboardProvider";
import { useEffect, useState } from "react";

export default function PaddleSelector() {
	const { theme, setTheme } = useDashboard();
	const [percentage, setPercentage] = useState(0);
	function ChangepaddleSpeed(e: any) {
		const newPaddleSpeed = 600 - Number(e.target.value);
		setTheme((prevTheme: ThemeColors) => ({
			...prevTheme,
			paddleSpeed: newPaddleSpeed
		}));
	}
	useEffect(() => {
		if (!theme) return;
		const currentValue = 600 - (theme?.paddleSpeed ? theme.paddleSpeed : 250);
		setPercentage(((currentValue - min) / (max - min)) * 100)
	}, [theme]);
	const min = 100;
	const max = 500;
	const colorFilled = "#00d3f3";
	const colorEmpty = "#E5E7EB";
	return (
		<>
			<div className="w-full max-w-md bg-cyan-900/10 p-4 rounded-lg shadow-sm shadow-gray-50/10 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<div className="flex justify-between text-sm font-medium text-white">
						<span>Paddle speed</span>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="range"
							min={min}
							max={max}
							step="10"
							value={600 - (theme?.paddleSpeed ? theme.paddleSpeed : 250)}
							onChange={ChangepaddleSpeed}

							style={{
								background: `linear-gradient(to right, ${colorFilled} 0%, ${colorFilled} ${percentage}%, ${colorEmpty} ${percentage}%, ${colorEmpty} 100%)`
							}}
							className="w-full h-2 rounded-lg appearance-none cursor-pointer 
                       accent-gray-100"
						/>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<label htmlFor="slide-effect" className="text-sm font-medium text-white cursor-pointer select-none">
						Activate slide effect
					</label>
					<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
						<input
							type="checkbox"
							name="slide-effect"
							id="slide-effect"
							checked={theme?.slide ? theme.slide : false}
							onChange={(e) =>
								setTheme(prevTheme => ({
									...prevTheme,
									slide: e.target.checked
								}))
							}
							className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer 
        						checked:right-0 right-5 transition-all duration-300 border-gray-300 checked:border-cyan-400"
						/>
						<div
							onClick={() =>
								setTheme(prevTheme => ({
									...prevTheme,
									slide: !prevTheme.slide
								}))
							}
							className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 
       							 ${theme?.slide ? 'bg-cyan-400' : 'bg-gray-300'}`}
						></div>
					</div>
				</div>

			</div>
		</>
	)
}