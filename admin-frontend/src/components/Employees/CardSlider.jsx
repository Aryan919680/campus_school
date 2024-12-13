import React, { useState } from "react";
import { Icon } from "@iconify/react";
import CommonCard from "../List/CommonCard";

const CardSlider = ({ cards }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex + 4 >= cards.length ? 0 : prevIndex + 4
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex - 4 < 0 ? Math.max(cards.length - 4, 0) : prevIndex - 4
		);
	};

	return (
		<div className=" mb-12">
			<div className="flex overflow-hidden">
				{cards.slice(currentIndex, currentIndex + 4).map((card, index) => (
					<div key={index} className="w-1/4 px-2">
						<CommonCard {...card} />
					</div>
				))}
			</div>
			{cards.length > 4 && (
				<div className="flex gap-2 justify-end">
					<button
						onClick={prevSlide}
						className="bg-black text-white rounded-full p-2 shadow-md"
					>
						<Icon icon="iconamoon:arrow-left-2-bold" height={24} />
					</button>
					<button
						onClick={nextSlide}
						className=" bg-black text-white rounded-full p-2 shadow-md"
					>
						<Icon icon="iconamoon:arrow-right-2-bold" height={24} />
					</button>
				</div>
			)}
		</div>
	);
};

export default CardSlider;
