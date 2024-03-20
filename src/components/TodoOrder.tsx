import { ArrowDownNarrowWide, ArrowDownWideNarrow, CaseSensitive, Check, Clock4, MessageCircleWarning } from "lucide-react";
import { useTodoOrder, type Order, type SortBy } from "@/components/TodoOrderProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TodoOrder() {
    const { sortBy, setSortBy, order, setOrder } = useTodoOrder();

    const itemIndicator = <Check color="hsl(var(--primary))" strokeWidth={5} />;

    const orderIcons = {
        created_at: <Clock4 />,
        title: <CaseSensitive />,
        priority: <MessageCircleWarning />,
        asc: <ArrowDownNarrowWide />,
        desc: <ArrowDownWideNarrow />,
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-auto w-auto gap-2">
                    {orderIcons[sortBy]} {orderIcons[order]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                    <DropdownMenuRadioItem value="created_at" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        {orderIcons.created_at}
                        Date created
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        {orderIcons.title}
                        Title
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priority" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        {orderIcons.priority}
                        Priority
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Order</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={order} onValueChange={(value) => setOrder(value as Order)}>
                    <DropdownMenuRadioItem value="asc" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        {orderIcons.asc}
                        Ascending
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        {orderIcons.desc}
                        Descending
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
