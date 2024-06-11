import { Text, TouchableOpacity, View } from 'react-native';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React from 'react';

function HelloWorldScene({ onInitialized }: { onInitialized?: () => void }) { 
  return (
    <ViroARScene onTrackingUpdated={onInitialized} />
  );
}

export default function TabOneScreen() {
    const arSceneRef = React.useRef<ViroARSceneNavigator>(null);
    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
    const [isRecording, setIsRecording] = React.useState<boolean>(false);
    const [video, setVideo] = React.useState<string | null>(null);
    function startRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRecording(true);
        // const randomId = Math.random().toString(36).substring(7);
        // const filename = `video-${randomId}.mp4`;
        // console.log('Recording on ID.', filename);
        const filename = "video_" + new Date();
        arSceneRef.current?.sceneNavigator.startVideoRecording(filename, true, (err) => {
            console.log('Error recording video:', err);
        });
    
    }
    async function stopRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRecording(false);
        const data = await arSceneRef.current?.sceneNavigator.stopVideoRecording();
        if (data.success) {
            console.log('Stopped recording', data);
        } else {
            console.log('Error recording video:', data);
        }
        // if (data.url) {
        //     setVideo(data.url);
        // }
    }
    // startVideoRecording
    React.useEffect(() => {
        console.log('INITIALIZED?', isInitialized);
        if (isInitialized) {
            // arSceneRef.current?.sceneNavigator.startVideoRecording('file.mp4', true, (err) => {
            //     console.log('Error recording video:', err);
            // });
            // TO FIX video recording error
            // Start video recording without saving when the component is initiating
            const filename = "video_" + new Date();
            arSceneRef.current?._startVideoRecording(
                filename,
                false,
                (err) => console.log('Record error', err)
            );
            // Stop video recording after 500ms
            setTimeout(() => {
                arSceneRef.current?._stopVideoRecording().then(result => {
                    if (!result.success) {
                        console.log('Record error', result.errorCode);
                    }
                });
            }, 500);
        }
    }, [isInitialized]);
    return (<>
          <View style={{ flex: 1 }}>
            <ViroARSceneNavigator ref={arSceneRef} autofocus initialScene={{
                scene: () => (
              <HelloWorldScene onInitialized={() => setIsInitialized(true)} />
          ) }} />
          <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
              <View style={{
                  position: 'absolute',
                  bottom: 15,
                  left: '50%',
                  width: 80,
                  borderRadius: 10,
                  marginLeft: -40,
                  zIndex: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  backgroundColor: isRecording ? 'red' : 'green',
              }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>{ isRecording ? "Stop" : "Start"}</Text>
              </View>
              </TouchableOpacity>
        </View>
        {video ? (
        <TouchableOpacity onPress={() => setVideo(null)}>
            <View style={{ flex: 1 }}>
                <Video
                    style={{
                        flex: 1,
                    }}
                    source={{
                        uri: video,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    shouldPlay
                    useNativeControls={false}
                />
            </View>
        </TouchableOpacity>
  ) : null}
    </>
    );
}