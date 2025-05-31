'use Client';

import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import TimerDisplay from './TimerDisplay';

export default function TimerApp(){
    return (
        <div className="min-h-screen flex items-center 
        justify-center bg-background p4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        作業時間
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <TimerDisplay minutes={25} seconds={0}/>
                </CardContent>
            </Card>

        </div>
    )
}