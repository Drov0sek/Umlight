import {Chart} from 'chart.js/auto'
import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import timeChecker from '../Styles/ProfileStyles/TimeChecker.module.css'

type TimeDataType = {
    id : number,
    user_id : number,
    role : string,
    active_time : number,
    active_time_day : string
}
type PropsType = {
    userId : number,
    role : string
}

const TimeChecker = ({userId, role} : PropsType) => {
    const [timeData, setTimeData] = useState<TimeDataType[]>([])
    const [graphTimeData, setGraphTimeData] = useState<TimeDataType[]>([])
    const [graphDays, setGraphDays] = useState<string[]>([])

    function getLastWeek(lastDate : string){
        const lastDay = Number(lastDate.split('.')[0])
        const lastMonth = Number(lastDate.split('.')[1])
        const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const weekArray : string[] = []
        for (let i = 6;i >= 0;i--){
            if (lastDay - i <= 0){
                const date = `${daysInMonths[lastMonth - 2 > 0 ? lastMonth - 2 : 11] + (lastDay - i)}.${lastMonth - 1 > 0 ? lastMonth - 1 : 12}`
                weekArray.push(date)
            } if (lastDay - i > 0){
                const date = `${lastDay - i}.${lastMonth}`
                weekArray.push(date)
            }
        }
        setGraphDays(weekArray)
    }


    useEffect(() => {
        const newArray = []
        for (let i = 0; i < graphDays.length; i++){
            const dayTimeData = timeData.filter(e => e.active_time_day === graphDays[i]) || []
            if (i >= 0){
                const dayTimeDatasObj : TimeDataType = {
                    id : i,
                    user_id : userId,
                    role : role,
                    active_time : dayTimeData.map(e => e.active_time).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / 1000 / 60 || 0,
                    active_time_day : graphDays[i]
                }
                newArray.push(dayTimeDatasObj)
            }
        }
        setGraphTimeData(newArray)
    }, [timeData]);
    useEffect(() => {
        async function getTimeData(){
            if (role === ''){
                return
            } else{
                try{
                    const resp = await fetch(`http://localhost:4200/api/getActiveTime/${userId}/${role}`)
                    if (resp.ok){
                        const userTimeData : TimeDataType[] = await resp.json()
                        setTimeData(userTimeData)
                        getLastWeek(userTimeData[userTimeData.length - 1].active_time_day)
                    } else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('При загрузке данных о вашем времени нахождения на сайте. Зайдите сюда позже')
                }
            }
        }
        getTimeData()
    }, [userId, role]);
    return (
        <section className={timeChecker.graphBlock}>
            <p className={timeChecker.title}>Время на сайте</p>
            <Line className={timeChecker.graph} data={{
                labels : graphDays,
                datasets : [
                    {
                        data : graphTimeData.map(e => `${e.active_time}`),
                        borderColor : '#3E3BFF',
                        pointBackgroundColor : '#3E3BFF'
                    }
                ]
            }} options={
                {
                    plugins : {
                        legend : {display : false}
                    },
                    scales : {
                        y: {
                            ticks: {
                                maxTicksLimit : 6,
                                font: {
                                    family: 'Montserrat-medium',
                                    size: 32,
                                    weight: 'bold',
                                },
                                color : '#000000',
                                padding : 10,
                                backdropColor : '#000000'
                            },
                        },
                        x: {
                            offset: true,
                            ticks: {
                                stepSize : 7,
                                font: {
                                    family: 'Montserrat-bold',
                                    size: 32,
                                    weight: 'bold',
                                },
                                color : '#000000',
                                backdropColor : '#000000'
                            },
                            grid : {
                                lineWidth : 0,
                                color : '#3E3BFF',
                                tickColor : '#000000'
                            },
                            position : 'right'
                        },
                    }
                }
            }/>
        </section>
    );
};

export default TimeChecker;