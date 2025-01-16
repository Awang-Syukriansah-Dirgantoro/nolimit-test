"use client";

import { useFilter } from '@/hooks/useFilter';
import 'chart.js/auto';
import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';

export default function ChartjsLine({ datas }) {
    const { filter, setFilter } = useFilter();
    const [labels, setLabels] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [backgroundColors, setBackgroundColors] = useState([]);

    const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
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
                label: datas? [] : datas.source[0].measures[0],
                data: datasets,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: backgroundColors,
                tension: 0.1,
            },
        ],
    };

    useEffect(() => {
        let from = filter.from;
        let to = filter.to;

        const filteredData = datas.data.filter(item => {
            const year = parseInt(item.Year, 10);
            return year >= from && year <= to;
        });

        setLabels(filteredData.map(data => data.Year).reverse());
        setDatasets(filteredData.map(data => data.Population).reverse());
        setBackgroundColors(labels.map(() => getRandomColor()));
    }, [datas,filter]);

    return (
        <>
            <Line data={data} className='h-[350px]'/>
        </>
    );
};
