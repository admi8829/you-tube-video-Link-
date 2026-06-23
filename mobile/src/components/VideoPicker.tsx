import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

interface VideoPickerProps {
  onVideoSelected: (uri: string, width: number, height: number) => void;
}

export const VideoPicker: React.FC<VideoPickerProps> = ({ onVideoSelected }) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are requested to choose raw clips!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setVideoUri(asset.uri);
      onVideoSelected(asset.uri, asset.width || 1920, asset.height || 1080);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Pick Landscape Clip from Gallery</Text>
      </TouchableOpacity>
      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay={false}
          style={styles.preview}
          useNativeControls
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 8,
  },
});
