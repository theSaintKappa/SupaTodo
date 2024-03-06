import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowDownNarrowWide, ArrowDownWideNarrow, CalendarDays, CaseSensitive } from "lucide-react";
import { useState } from "react";

export function TodoSort() {
    const [open, setOpen] = useState(false);

    return (
        <Select defaultValue="date_created" open={open} onOpenChange={setOpen}>
            <SelectTrigger className="h-auto w-auto">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup className="mb-2">
                    <SelectLabel className="opacity-50 text-xs ml-[-0.75rem]">Sort by</SelectLabel>
                    <SelectItem value="date_created" className="data-[state=checked]:text-primary data-[state=checked]:font-bold">
                        <span className="flex gap-1">
                            <CalendarDays />
                            Date created
                        </span>
                    </SelectItem>
                    <SelectItem value="alphabetical" className="data-[state=checked]:text-primary data-[state=checked]:font-bold">
                        <span className="flex gap-1">
                            <CaseSensitive />
                            Alphabetical
                        </span>
                    </SelectItem>
                    <SelectItem value="priority" className="data-[state=checked]:text-primary data-[state=checked]:font-bold">
                        <span className="flex gap-1">
                            <AlertTriangle />
                            Priority
                        </span>
                    </SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel className="opacity-50 text-xs ml-[-0.75rem]">Order</SelectLabel>
                    <RadioGroup defaultValue="asc" onValueChange={() => setOpen(false)}>
                        <div className="flex flex-col gap-4 p-2">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="asc" id="asc" />
                                <Label htmlFor="asc" className="flex items-center cursor-pointer">
                                    <ArrowDownNarrowWide />
                                    Ascending
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="desc" id="desc" />
                                <Label htmlFor="desc" className="flex items-center cursor-pointer">
                                    <ArrowDownWideNarrow />
                                    Descenging
                                </Label>
                            </div>
                        </div>
                    </RadioGroup>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
