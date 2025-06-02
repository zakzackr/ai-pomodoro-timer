'use client';

import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import { useState, useEffect } from 'react';

export default function TimerApp(){
    // timerの実行状態を管理するstate
    const [isRunning, setIsRunning] = useState(false);

    // timerの残り時間を保持する状態変数
    const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
    

    // 開始・停止ボタンのハンドラ
    const handleStart = () => {
        setIsRunning(!isRunning);
    }

    // リセットボタンのハンドラ
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft({ minutes: 25, seconds: 0 })
    }

    useEffect(() => {
        // setIntervalの戻り値（タイマーID）を保持する変数（Timeout obj.を保持）
        let intervalId: NodeJS.Timeout;

        if (isRunning){
            intervalId = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev.seconds === 0){
                        if (prev.minutes === 0){
                            setIsRunning(false);
                            return prev; // 00:00をそのまま返す
                        }
                        return { minutes: prev.minutes - 1, seconds: 59 };
                    }
                    return { ...prev, seconds: prev.seconds - 1 };
                })
            }, 1000)
        }

        // cleanup関数
        return () => {
            if (intervalId){
                clearInterval(intervalId);
            }
        }

    }, [isRunning])

    return (
        <div className="min-h-screen flex items-center 
        justify-center bg-background p4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        作業時間
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <TimerDisplay minutes={timeLeft.minutes} seconds={timeLeft.seconds}/>
                    <Controls onStart={handleStart} onReset={handleReset} isRunning={isRunning} />
                </CardContent>
            </Card>

        </div>
    )
}