sed -i 's/if (videoRef.current) {/const videoElement = videoRef.current;\n    if (videoElement) {/g' src/components/VideoPlayer.tsx
sed -i 's/videoRef.current.load()/videoElement.load()/g' src/components/VideoPlayer.tsx
sed -i 's/if (videoRef.current && initialProgress > 0 && initialProgress < 99) {/if (videoElement \&\& initialProgress > 0 \&\& initialProgress < 99) {/g' src/components/VideoPlayer.tsx
sed -i 's/const duration = videoRef.current.duration || 1;/const duration = videoElement.duration || 1;/g' src/components/VideoPlayer.tsx
sed -i 's/videoRef.current.currentTime = (initialProgress \/ 100) \* duration;/videoElement.currentTime = (initialProgress \/ 100) \* duration;/g' src/components/VideoPlayer.tsx
sed -i 's/videoRef.current.addEventListener/videoElement.addEventListener/g' src/components/VideoPlayer.tsx
sed -i 's/if (videoRef.current) {/if (videoElement) {/g' src/components/VideoPlayer.tsx
sed -i 's/videoRef.current.removeEventListener/videoElement.removeEventListener/g' src/components/VideoPlayer.tsx
sed -i 's/}, \[tutorial.id\]);/}, \[tutorial.id, initialProgress\]);/g' src/components/VideoPlayer.tsx
