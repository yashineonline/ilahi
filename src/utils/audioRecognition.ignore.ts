export async function recordAudio(): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  return new Promise<Blob>((resolve) => {
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      stream.getTracks().forEach(track => track.stop());
      resolve(audioBlob);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
  });
}
  
// ... existing recordAudio function ...

export async function identifySong(audio: Blob): Promise<string> {
  try {
    // Convert Blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(audio);
    });

    // Use AudD API for song identification
    const response = await fetch('https://api.audd.io/', {
      method: 'POST',
      body: JSON.stringify({
        api_token: import.meta.env.VITE_AUDD_API_KEY,
        audio: base64Audio.split(',')[1],
        return: 'apple_music,spotify',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'success' && data.result) {
      return `${data.result.artist} - ${data.result.title}`;
    } else {
      return 'Song not identified';
    }
  } catch (error) {
    console.error('Song identification error:', error);
    return 'Error identifying song';
  }
}  
  
  