import { cn } from "@/lib/utils";

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {}

const Col: React.FC<ColProps> = ({ className, children, ...props }) => {
	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			{children}
		</div>
	);
};

export default Col;
