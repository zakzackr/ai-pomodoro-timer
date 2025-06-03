'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from "@/components/ui/separator"
import TimerDisplay from './TimerDisplay';
import Question from './Question';
import Controls from './Controls';
import { useState, useEffect } from 'react';
import { useReward } from 'react-rewards';
import { playNotificationSound } from '@/utils/sound';
import MetadataUpdater from './MetadataUpdater';
import { generateRefreshSuggestion } from '@/utils/gemini';


type Mode = 'work' | 'break'; 

export default function TimerApp(){
    const { reward: confetti } = useReward('confetti-reward', 'confetti', {
        elementCount: 100,
        spread: 70,
        decay: 0.93,
        lifetime: 150
    })
    // timerの実行状態を管理するstate
    const [isRunning, setIsRunning] = useState(false);

    const [workMinutes, setWorkMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);

    // 自動開始機能の設定
    const [autoStart, setAutoStart] = useState(false);

    // 復習用の問題
    const [question, setQuestion] = useState<string | null >(null);

    const [task, setTask] = useState('');

    // timerの残り時間を保持する状態変数
    const [timeLeft, setTimeLeft] = useState({ minutes: workMinutes, seconds: 0 });
    
    const [mode, setMode] = useState<Mode>('work');

    const toggleMode = () => {
        // modeの切り替え
        const newMode = mode === 'work'? 'break': 'work';
        setMode(newMode)

        // 各modeの初期値を設定
        setTimeLeft({
            minutes: newMode === 'work'? workMinutes: breakMinutes,
            seconds: 0
        })

        if (newMode === 'break'){
            if (task !== ''){
                generateRefreshSuggestion(task)
                    .then((question) => setQuestion(question))
                    .catch(console.error)
            }
        }

        // mode切り替え時の自動スタートのON/OFF
        setIsRunning(autoStart);
    }

    // 開始・停止ボタンのハンドラ
    const handleStart = () => {
        setIsRunning(!isRunning);
    }

    // リセットボタンのハンドラ
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft({ 
            minutes: mode === 'work'? workMinutes: breakMinutes, 
            seconds: 0 
        });
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
                            if (mode === 'work'){
                                void confetti();
                            }
                            void playNotificationSound();
                            // toggleMode();
                            setTimeout(() => {
                                toggleMode();
                            }, 100)
                            return prev; // 現在の状態を返す
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
        justify-center bg-background p4 relative">
            <span id="confetti-reward" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        { mode === 'work'? '作業時間': '休憩時間' }
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <TimerDisplay minutes={timeLeft.minutes} seconds={timeLeft.seconds} mode ={mode}/>
                    <Controls onStart={handleStart} onReset={handleReset} onModeToggle={toggleMode} isRunning={isRunning} />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 w-full max-w-[200px] mx-auto">
                    <div className="flex items-center gap-2 w-full justify-between">
                        <label className="text-sm font-medium min-w-[3.5rem]">作業時間</label>
                        <select 
                            value={workMinutes}
                            onChange={(e) => {
                                const newWorkMinutes = parseInt(e.target.value);
                                setWorkMinutes(newWorkMinutes);
                                if (mode === 'work' && !isRunning){
                                    setTimeLeft({ minutes: newWorkMinutes, seconds: 0 })
                                }
                            }}
                            className="p-2 min-w-[5rem] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            {[15, 20, 25, 30, 45, 60, 90, 120].map((minutes) => (
                                <option key={minutes} value={minutes}>
                                    {minutes}分
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 w-full justify-between">
                        <label className="text-sm font-medium min-w-[3.5rem]">休憩時間</label>
                        <select 
                            value={breakMinutes}
                            onChange={(e) => {
                                const newBreakMinutes = parseInt(e.target.value);
                                setBreakMinutes(newBreakMinutes);
                                if (mode === 'break' && !isRunning){
                                    setTimeLeft({ minutes: newBreakMinutes, seconds: 0 })
                                }
                            }}
                            className="p-2 min-w-[5rem] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            {[5, 10, 15, 20, 25, 30].map((minutes) => (
                                <option key={minutes} value={minutes}>
                                    {minutes}分
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 w-full justify-between">
                        <label className="text-sm font-medium min-w-[3.5rem]">自動開始</label>
                        <Switch 
                            checked={autoStart}
                            onCheckedChange={() => setAutoStart(!autoStart)}
                            className="cursor-pointer"
                        />  
                    </div>
                </CardFooter>
                <Separator />
                <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-bold min-w-[3.5rem">作業内容</label>
                    <Textarea
                        className="w-full max-w-xs"
                        placeholder="作業内容を入力すると、AIが復習用の問題を出題してくれます。例）英語 単語 高校生レベル"
                        value={task}
                        onChange={e => setTask(e.target.value)} 
                    />
                </div>
            </Card>
            <MetadataUpdater minutes={timeLeft.minutes} seconds={timeLeft.seconds} mode={mode} />
            <Question question={question} onClose={() => setQuestion(null)}></Question>
        </div>
    )
}