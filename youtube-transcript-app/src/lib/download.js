import { saveAs } from 'file-saver';

export function downloadAsSRT(transcript, filename = 'transcript') {
    let srtContent = '';
    transcript.forEach((item, index) => {
        const startTime = formatSRTTime(item.offset);
        const endTime = formatSRTTime(item.offset + (item.duration || 2000));
        srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${item.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.srt`);
}

export function downloadAsTXT(transcript, filename = 'transcript') {
    const txtContent = transcript.map((item) => item.text).join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.txt`);
}

export function downloadAsJSON(transcript, videoInfo, filename = 'transcript') {
    const data = {
        videoInfo,
        transcript,
        exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    saveAs(blob, `${filename}.json`);
}

function formatSRTTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 3)}`;
}

function pad(num, size) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}
