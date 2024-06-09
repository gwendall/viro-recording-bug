import { Text, TouchableOpacity, View } from 'react-native';
import { ViroARScene, ViroARSceneNavigator, ViroText } from '@reactvision/react-viro';
import React from 'react';
import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';

function HelloWorldScene() {
  return (
    <ViroARScene />
  );
}

export default function TabOneScreen() {
    const arSceneRef = React.useRef<ViroARSceneNavigator>(null);
    const [started, setStarted] = React.useState<boolean>(false);
    const [isRecording, setIsRecording] = React.useState<boolean>(false);
    const [video, setVideo] = React.useState<string | null>(null);
    function startRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRecording(true);
        const randomId = Math.random().toString(36).substring(7);
        const filename = `video-${randomId}.mp4`;
        console.log('Recording on ID.', filename);
        arSceneRef.current?.sceneNavigator.startVideoRecording(filename, true, (err) => {
            console.log('Error recording video:', err);
        });
    
    }
    async function stopRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRecording(false);
        const data = await arSceneRef.current?.sceneNavigator.stopVideoRecording();
        console.log('Stopped recording', data);
        // if (data.url) {
        //     setVideo(data.url);
        // }
    }
  // startVideoRecording
    return !started ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStarted(true);
            }}>
              <View style={{
                  width: 80,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  backgroundColor: '#ff00ff'
              }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase',
                    }}>
                        ENTER
                  </Text>
                </View>
            </TouchableOpacity>
        </View>
    ) : video ? (
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
  ) : (
      <View style={{ flex: 1 }}>
          <ViroARSceneNavigator ref={arSceneRef} autofocus initialScene={{ scene: HelloWorldScene }} />
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
  );
}