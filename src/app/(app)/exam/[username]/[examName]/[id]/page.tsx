'use client';

import { useParams } from 'next/navigation';
import statistics from '@/assets/statistics.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { AreaChart, BarChartBig, Download, FileBarChart, FileQuestion, LineChart, MoveRight, ScatterChart, Target } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'react-query'; // Importing useQuery

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import AnalyzedCard from '@/components/custom/AnalyzedCard';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const difficultyLevels = ['easy', 'medium', 'hard', 'very hard', 'extreme'];

function Page() {
    // chart data
    const [chartData, setChartData] = useState<any>({});
    const [chartOptions, setChartOptions] = useState<any>({});

    const [impKeywords, setImpKeywords] = useState<string[]>([]);
    const [highTopicFrequency, setHighTopicFrequency] = useState<string[]>([]);
    const [lowTopicFrequency, setLowTopicFrequency] = useState<string[]>([]);
    const [impQa, setImpQa] = useState<string[]>([]);
    const [examDifficulty, setExamDifficulty] = useState<any>({});
    const [allQuestions, setAllQuestions] = useState<any>({});
    const [blueprint, setBlueprint] = useState<any>({});
    const [pdfUrl, setPdfUrl] = useState<string[]>([]);
    const [examName, setExamName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [fileCount, setFileCount] = useState<number>(0);
    const [impCount, setImpCount] = useState<number>(0);
    const [totalQa, setTotalQa] = useState<number>(0);
    const [fileName, setFileName] = useState<string[]>([]);

    // to get data from params
    const params = useParams<{ username: string, examName: string, id: string }>();
    const { toast } = useToast();

    // Using useQuery instead of useState
    const { data: document, isLoading, isError } = useQuery(['analyzedData', params.id], async () => {
        // Fetching data with axios
        const { data } = await axios.post(`/api/get-analyzed-data`, {
            id: params.id
        });
        console.log("i am data", data);

        return data;
    }, {
        enabled: !!params.id, // Ensuring the query is only executed when params.id is available
        onError: () => {
            toast({
                variant: "destructive",
                title: "Can't find Data For You !",
                description: "Try again after some time !"
            });
        }
    });

    useEffect(() => {
        if (document) {
            const {
                imp_keywords,
                high_topic_frequency,
                low_topic_frequency,
                imp_qa,
                exam_difficulty,
                all_questions,
                blueprint,
                pdf_url,
                exam_name,
                username,
                file_count,
                imp_count,
                total_qa,
                file_name
            } = document.document;
            console.log(document.document, imp_keywords, JSON.parse(high_topic_frequency))

            setImpKeywords(JSON.parse(imp_keywords));
            setHighTopicFrequency(JSON.parse(high_topic_frequency));
            setLowTopicFrequency(JSON.parse(low_topic_frequency));
            setImpQa(JSON.parse(imp_qa));
            setExamDifficulty(JSON.parse(exam_difficulty));
            setAllQuestions(JSON.parse(all_questions));
            setBlueprint(JSON.parse(blueprint));
            setPdfUrl(pdf_url);
            setExamName(exam_name);
            setUsername(username);
            setFileCount(file_count);
            setImpCount(imp_count);
            setTotalQa(total_qa);
            setFileName(file_name);

        } else {
            console.log("i am not here");
        }
    }, [document]);

    useEffect(() => {

        const difficultyValues = Object.values(examDifficulty).map((level) => difficultyLevels.indexOf(level) + 1);
        const chartData = {
            labels: fileName.map(file => file.replace(".pdf", "").slice(0,10) + "..."),
            datasets: [
                {
                    label: 'Difficulty Of Exams',
                    data: difficultyValues,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235, 0.4)',
                }
            ]
        };
        setChartData(chartData);
        setChartOptions({
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
            },
            scales: {
                y: {
                    type: 'linear',
                    ticks: {
                        callback: function (value) {
                            return difficultyLevels[value - 1]; // Convert numeric value to difficulty level
                        },
                        stepSize: 1,
                        max: difficultyLevels.length,
                        min: 1
                    }
                }
            }
        });

        console.log("State updated:", {
            impKeywords, highTopicFrequency, lowTopicFrequency, impQa, examDifficulty, allQuestions, blueprint, pdfUrl, examName, username, fileCount, impCount, totalQa, fileName
        });

    }, [impKeywords, highTopicFrequency, lowTopicFrequency, impQa, examDifficulty, allQuestions, blueprint, pdfUrl, examName, username, fileCount, impCount, totalQa, fileName]);

    const uploadRules = [
        "Upload Only Valid Exam Paper PDFs",
        "Only 10 files Allowed Per Submission",
        "Total size can’t be up to 10 Mb",
        "Provide Authorized and Error Free PDF",
        "Photo Clicked Exam Papers can't be processed"
    ];

    return (
        <div className='p-4 flex flex-col gap-4'>
            <div>
                <p className='text-lg md:text-md font-bold text-blue-600'>{(document?.document?.exam_name) || "Analyzed Data"}</p>
            </div>
            <div className='bg-blue-600 rounded-md h-full flex justify-between items-center p-5 md:p-10 w-full'>
                <div className='w-full md:w-[75%] h-full flex flex-col gap-4 leading-[10px]'>
                    {uploadRules.map((rule, index) => (
                        <p key={index} className='text-white font-extralight'>{rule}</p>
                    ))}
                </div>
                {/* illustration */}
                <div className='w-[20%] hidden md:block'>
                    <Image src={statistics} alt="upload illustration" />
                </div>
            </div>
            <div className='flex gap-4'>
                <Download />
                <p className='text-black font-semibold'>Files</p>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='w-full flex gap-4 flex-wrap'>
                    {document?.document?.pdf_url?.map((url: string, index) => (
                        <Link key={index} href={url} target='_blank' className='bg-gray-200 hover:bg-gray-300 transition-all w-full md:w-1/4 p-2 rounded-md border-2 border-gray-300'>
                            <div className='flex gap-4'>
                                <div>
                                    <FileQuestion />
                                </div>
                                <div>
                                    <p className='font-medium text-md'>
                                        {document.document.file_name[index]}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <div className='mt-4 w-full'>
                <div className='flex gap-4 mb-4'>
                    <FileBarChart />
                    <p className='text-black font-semibold'>Files</p>
                </div>
                {/* row 1 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {document?.document?.imp_qa && (
                        <AnalyzedCard
                            title="Most Asked Questions"
                            result={impQa}
                            icon={<BarChartBig />}
                        />
                    )}
                    {document?.document?.exam_difficulty && (
                        <Card>
                            <CardHeader>
                                <div className='flex gap-4'>
                                    <AreaChart />
                                    <p className='font-bold'>Visualize Exam Difficulty</p>
                                </div>
                            </CardHeader>
                            <CardContent className='flex justify-center flex-col w-full'>
                                <div className="w-full">
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                {/* row 2 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    {document?.document?.imp_qa && (
                        <AnalyzedCard
                            title="High Frequency Questions"
                            result={highTopicFrequency}
                            icon={<LineChart />}
                        />
                    )}
                    {document?.document?.imp_qa && (
                        <AnalyzedCard
                            title="Low Frequency Questions"
                            result={lowTopicFrequency}
                            icon={<ScatterChart />}
                        />
                    )}
                </div>


                {/* row 3 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    {document?.document?.imp_qa && (
                        <AnalyzedCard
                            title="Important Topics"
                            result={impKeywords}
                            icon={<Target />}
                        />
                    )}

                </div>
            </div>


        </div>
    );
}

export default Page;