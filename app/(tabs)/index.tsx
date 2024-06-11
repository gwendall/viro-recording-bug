import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React from 'react';

function HelloWorldScene({ onInitialized }: { onInitialized?: () => void }) {
    return (
        <ViroARScene onTrackingUpdated={onInitialized} />
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 15,
        left: '50%',
        width: 80,
        height: 50,
        borderRadius: 10,
        marginLeft: -40,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: 'green',
    }
});

const rumble = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

function ARScene() {
    const arSceneRef = React.useRef<ViroARSceneNavigator>(null);
    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
    const [isRecording, setIsRecording] = React.useState<boolean>(false);
    const [video, setVideo] = React.useState<string | null>(null);
    function startRecording() {
        const filename = "video_" + new Date();
        arSceneRef.current?._startVideoRecording(filename, true, (err) => {
            console.log('Error recording video:', err);
        });
        rumble();
        setIsRecording(true);
    }
    async function stopRecording() {
        rumble();
        setIsRecording(false);
        const data = await arSceneRef.current?._stopVideoRecording();
        if (data.success) {
            console.log('Stopped recording', data);
        } else {
            console.log('Error recording video:', data);
        }
    }
    React.useEffect(() => {
        console.log('INITIALIZED?', isInitialized);
        if (isInitialized) {
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
                )
            }} />
            <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
                <View style={[styles.button, {
                    backgroundColor: isRecording ? 'red' : 'green',
                }]}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase',
                    }}>{isRecording ? "Stop" : "Start"}</Text>
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

export default function TabOneScreen() {
    const [isStarted, setIsStarted] = React.useState<boolean>(false);
    return isStarted ? <ARScene /> : (
        <>
            <Pressable style={[styles.button, { bottom: '50%', transform: [{ translateY: 25 }] }]} onPress={() => (rumble(), setIsStarted(true))}>
                <Text style={{
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase',
                }}>
                    ENTER
                </Text>
            </Pressable>
        </>
    );
}