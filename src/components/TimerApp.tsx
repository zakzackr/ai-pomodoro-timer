'use client';

import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import { useState } from 'react';

export default function TimerApp(){
    // timerの実行状態を管理するstate
    const [isRunning, setIsRunning] = useState(false);

    // 開始・停止ボタンのハンドラ
    const handleStart = () => {
        setIsRunning(!isRunning);
    }

    // リセットボタンのハンドラ
    const handleReset = () => {
        setIsRunning(false);
    }

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
                    <TimerDisplay minutes={25} seconds={0}/>
                    <Controls onStart={handleStart} onReset={handleReset} isRunning={isRunning} />
                </CardContent>
            </Card>

        </div>
    )
}