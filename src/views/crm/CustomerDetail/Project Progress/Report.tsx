import Chart from 'react-apexcharts';
import { COLORS } from '@/constants/chart.constant';
import { Card } from '@/components/ui';
import { useEffect, useState } from 'react';
import { apiGetCrmSingleProjectReport } from '@/services/CrmService';
import { useLocation } from 'react-router-dom';

interface TaskData {
  task_name: string;
  percentage: number;
}

interface ChartData {
  series: { data: number[] }[];
  categories: string[];
}

const Report = ({report}:any) => {
  const location = useLocation();
  const [chartWidth, setChartWidth] = useState<number>(window.innerWidth > 768 ? 500 : window.innerWidth - 40);
  const query = new URLSearchParams(location.search);
  const projectId = query.get('project_id');
  const [data, setData] = useState<TaskData[]>([]);
  const [chartData, setChartData] = useState<ChartData>({ series: [], categories: [] });

  useEffect(() => {
    const handleResize = () => {
      const updatedWidth = window.innerWidth > 768 ? 500 : window.innerWidth - 40;
      setChartWidth(updatedWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (report) {
        const taskNames = report.data.map((task: TaskData) => task.task_name);
        const percentages = report.data.map((task: TaskData) => task.percentage);
        setChartData({
          series: [{ data: percentages }],
          categories: taskNames,
        });
      }
    };
    fetchData();
  }, [projectId]);

  console.log({
    data: data.map((item) => item.percentage),
  });

  return (
    <Card className='lg:w-3/5'>
      <h4 className='font-bold capitalize py-3'>Project Progress Report</h4>
      <Chart
        options={{
          plotOptions: {
            bar: {
              horizontal: true,
            },
            
          },
          tooltip:{
            x: {
                formatter: function(val, { series, seriesIndex, dataPointIndex, w }) {
                  return `${w.config.xaxis.categories[dataPointIndex]}`;
                }
              },
              y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                  return `${val}%`;
                },
                title: {
                  formatter: function () {
                    return '';
                  }
                }},
            
          },
          colors: COLORS,
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: chartData.categories,
          },
          yaxis: {
            min: 0,
            max: 100,
            labels: {
              formatter: function (val: number) {
                return `${val}`;
              },
            },
          },
          
        }}
        series={chartData.series}
        type="bar"
        height={chartData.series[0]?.data.length===1? 120:chartData.series[0]?.data.length*75 || 75}
        
      />
    </Card>
  );
};

export default Report;