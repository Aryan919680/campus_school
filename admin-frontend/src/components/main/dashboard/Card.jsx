import React from "react";
import { Icon } from "@iconify/react";

const Card = (props) => {
	return (
		<div className="bg-white md:w-[200px] w-[150px] h-auto mx-4 my-8 card-shadow">
			<div className="flex justify-between items-center">
				<div className="h-full bg-black">
					<div className="relative w-16">
						<div
							className={`h-16 w-16 flex items-center justify-center rounded-2xl absolute -top-12 left-2 ${props.iconClass} ${props.iconColor}`}
						>
							<Icon icon={props.icon} height={36} />
						</div>
					</div>
				</div>
				<div className="w-fit p-4">
					<h4 className="card-title font-bold text-2xl text-right">
						{props.number}
					</h4>
				</div>
			</div>
			<div className="border-t-2 py-2">
				<h4 className="card-title text-sm font-bold text-[#7B809A] text-center">
					{props.title}
				</h4>
			</div>
		</div>
	);
};

export default Card;
