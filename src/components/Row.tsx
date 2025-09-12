import { cn } from "@/lib/utils";
import type React from "react";

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {}

const Row: React.FC<RowProps> = ({ children, className, ...props }) => {
	return (
		<div className={cn("flex gap-2", className)} {...props}>
			{children}
		</div>
	);
};

export default Row;
