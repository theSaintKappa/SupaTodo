import { AlertTriangle, ArrowDownNarrowWide, ArrowDownWideNarrow, CalendarDays, CaseSensitive, Check, ChevronDown } from "lucide-react";
import { useTodoOrder, type Order, type SortBy } from "./TodoOrderProvider";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function TodoOrder() {
    const { sortBy, setSortBy, order, setOrder } = useTodoOrder();

    const itemIndicator = <Check color="hsl(var(--primary))" strokeWidth={5} />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-auto w-auto">
                    {sortBy} ({order})
                    <ChevronDown className="h-6 min-w-6 mr-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                    <DropdownMenuRadioItem value="created_at" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        <CalendarDays className="h-5 min-w-5" />
                        Date created
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        <CaseSensitive className="h-5 min-w-5" />
                        Title
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priority" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        <AlertTriangle className="h-5 min-w-5" />
                        Priority
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Order</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={order} onValueChange={(value) => setOrder(value as Order)}>
                    <DropdownMenuRadioItem value="asc" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        <ArrowDownNarrowWide />
                        Ascending
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc" className="gap-1 cursor-pointer" itemIndicator={itemIndicator}>
                        <ArrowDownWideNarrow />
                        Descending
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
