export async function playNotificationSound(){
    try {
        // 通知オンを鳴らす
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.2;
        await audio.play();
        
        return new Promise<void>((resolve => {
            audio.onended = () => {
                resolve();
            }
        }))
    } catch(error){
        console.error('通知オンの再生に失敗', error);
    }
}