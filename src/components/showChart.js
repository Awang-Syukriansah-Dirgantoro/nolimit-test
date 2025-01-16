"use client";

import { useData } from "@/hooks/useData";
import 'chart.js/auto';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function ShowChart(params) {
    const { data: datas = {}, isLoading } = useData();
    const [labels, setLabels] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [backgroundColors, setBackgroundColors] = useState([]);

    console.log(datas, isLoading);

    const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
        ssr: false,
    });

    const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
        ssr: false,
    });

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: isLoading ? [] : datas.source[0].measures[0],
                data: datasets,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: backgroundColors,
                tension: 0.1,
            },
        ],
    };

    const handleChangeDateFrom = (value) => {
        setDateFrom(value)
    }

    const handleChangeDateTo = (value) => {
        setDateTo(value)
    }

    useEffect(() => {
        if (!isLoading) {
            let from = dateFrom;
            let to = dateTo;
    
            if (dateFrom == null && dateTo == null) {
                from = datas.data[datas.data.length - 1]?.Year;
                to = datas.data[0]?.Year;
                setDateFrom(from);
                setDateTo(to);
            }
    
            // console.log(from, to);
            
            const filteredData = datas.data.filter(item => {
                const year = parseInt(item.Year, 10);
                return year >= from && year <= to;
            });
    
            setLabels(filteredData.map(data => data.Year).reverse());
            setDatasets(filteredData.map(data => data.Population).reverse());
            setBackgroundColors(labels.map(() => getRandomColor()));
        }
    }, [isLoading, dateFrom, dateTo]);

    return (
        <>
            <div className="max-w-sm w-full md:max-w-full md:flex">
                <div className="border border-gray-400 md:border-gray-400 bg-white rounded p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                        <p className="text-sm text-gray-600 flex items-center">
                            {!isLoading && datas.source[0].annotations.dataset_name}
                        </p>
                        <div className="text-gray-900 font-bold text-xl mb-2">{!isLoading && datas.source[0].annotations.source_name}</div>
                        <p className="text-gray-700 text-base">{!isLoading && datas.source[0].annotations.source_description}</p>
                    </div>
                    <div className="mb-8">
                        <table className="table-fixed w-full border border-gray-400 rounded p-3">
                            <thead>
                                <tr>
                                    <th className="border">ID Nation</th>
                                    <th className="border">ID Year</th>
                                    <th className="border">Nation</th>
                                    <th className="border">Population</th>
                                    <th className="border">Slug Nation</th>
                                    <th className="border">Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoading && datas.data.map((population, index) =>
                                    <tr key={index}>
                                        <td className="border">{population["ID Nation"]}</td>
                                        <td className="border">{population["ID Year"]}</td>
                                        <td className="border">{population["Nation"]}</td>
                                        <td className="border">{population["Population"]}</td>
                                        <td className="border">{population["Slug Nation"]}</td>
                                        <td className="border">{population["Year"]}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-8">
                        {!isLoading &&
                            <div className="flex">
                                <span className="px-2">From : </span>
                                <Select defaultValue={dateFrom} onValueChange={handleChangeDateFrom}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {/* <SelectLabel>Fruits</SelectLabel> */}
                                            {!isLoading && datas.data.map((population, index) =>
                                                <SelectItem key={index} value={population["Year"]}>{population["Year"]}</SelectItem>
                                            )}
                                            {/* <SelectItem value="apple">Apple</SelectItem>
                                        <SelectItem value="banana">Banana</SelectItem>
                                        <SelectItem value="blueberry">Blueberry</SelectItem>
                                        <SelectItem value="grapes">Grapes</SelectItem>
                                        <SelectItem value="pineapple">Pineapple</SelectItem> */}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <span className="px-2">To : </span>
                                <Select defaultValue={dateTo} onValueChange={handleChangeDateTo}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {!isLoading && datas.data.map((population, index) =>
                                                <SelectItem key={index} value={population["Year"]}>{population["Year"]}</SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        }
                        <Line data={data} />
                        <Pie data={data} />
                    </div>
                    <div className="flex items-center">
                        <div className="text-sm">
                            <p className="text-gray-900 leading-none">{!isLoading && datas.source[0].annotations.dataset_link}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
