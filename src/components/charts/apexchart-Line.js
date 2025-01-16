"use client";

import { useFilter } from '@/hooks/useFilter';
import 'chart.js/auto';
import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';

export default function ApexChartLine({ datas }) {
    const { filter, setFilter } = useFilter();
    const [labels, setLabels] = useState({});
    const [datasets, setDatasets] = useState([]);

    const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

    useEffect(() => {
        let from = filter.from;
        let to = filter.to;

        const filteredData = datas.data.filter(item => {
            const year = parseInt(item.Year, 10);
            return year >= from && year <= to;
        });

        setLabels({
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: filteredData.map(data => data.Year).reverse()
            },
        })
        setDatasets([
            {
                name: "Sales",
                data: filteredData.map(data => data.Population).reverse()
            }
        ])
    }, [datas, filter]);

    return (
        <>
            <ReactApexChart options={labels} series={datasets} type="line" height={350} />
        </>
    );
};
