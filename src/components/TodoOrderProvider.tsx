import { type PropsWithChildren, createContext, useContext, useState } from "react";

export type SortBy = "created_at" | "title" | "priority";
export type Order = "asc" | "desc";

interface TodoOrderProviderProps {
    defaultSortBy?: SortBy;
    defaultOrder?: Order;
    sortByStorageKey?: string;
    orderStorageKey?: string;
}

interface TodoOrderState {
    sortBy: SortBy;
    setSortBy: (sortBy: SortBy) => void;

    order: Order;
    setOrder: (order: Order) => void;
}

const initialState: TodoOrderState = {
    sortBy: "created_at",
    setSortBy: () => null,

    order: "desc",
    setOrder: () => null,
};

export const TodoOrderProviderContext = createContext<TodoOrderState>(initialState);

export const TodoOrderProvider = ({ children, defaultSortBy = initialState.sortBy, defaultOrder = initialState.order, sortByStorageKey = "todos-sort-by", orderStorageKey = "todos-order", ...props }: PropsWithChildren<TodoOrderProviderProps>) => {
    const [sortBy, setSortBy] = useState<SortBy>(() => (localStorage.getItem(sortByStorageKey) as SortBy) || defaultSortBy);
    const [order, setOrder] = useState<Order>(() => (localStorage.getItem(orderStorageKey) as Order) || defaultOrder);

    const value = {
        sortBy,
        setSortBy: (sortBy: SortBy) => {
            localStorage.setItem(sortByStorageKey, sortBy);
            setSortBy(sortBy);
        },

        order,
        setOrder: (order: Order) => {
            localStorage.setItem(orderStorageKey, order);
            setOrder(order);
        },
    };

    return (
        <TodoOrderProviderContext.Provider {...props} value={value}>
            {children}
        </TodoOrderProviderContext.Provider>
    );
};

export const useTodoOrder = () => {
    const context = useContext(TodoOrderProviderContext);

    if (context === undefined) throw new Error("useTodoOrder must be used within a TodoOrderProvider");

    return context;
};
