import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useData(filter) {
    return useQuery({
        queryKey: ["divisi"],
        queryFn: () => axios.get("https://datausa.io/api/data?drilldowns=Nation&measures=Population")
            .then((res) => res.data),
    });
}
