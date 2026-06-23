import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { VideoPicker } from '../components/VideoPicker';
import { reframeVideo } from '../services/ffmpegService';
import { detectSpeakerKeyframes } from '../services/faceTracking';

export interface VideoState {
  uri: string;
  width: number;
  height: number;
  type: 'gallery' | 'youtube';
}

export const HomeScreen: React.FC = () => {
  const [video, setVideo] = useState<VideoState | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleYoutubeSubmit = () => {
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      alert('Please input a valid YouTube video reference URL!');
      return;
    }
    setVideo({
      uri: youtubeUrl,
      width: 1920,
      height: 1080,
      type: 'youtube',
    });
    setStatusText('YouTube video linked. Ready for server-assisted meta-crop extraction!');
  };

  const startReframeJob = async () => {
    if (!video) {
      alert('Please load a custom YouTube URL or select a video from your gallery first!');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusText('Stage 1: Running deep on-device Core MLKit Face/Speaker tracking...');
      
      const keyframes = await detectSpeakerKeyframes(video.uri, video.width, video.height);
      
      setStatusText('Stage 2: Compiling custom local hardware-accelerated ffmpeg filter graph...');
      const outputPath = await reframeVideo(video.uri, keyframes, video.width, video.height);
      
      setStatusText('Success! Transcoded to 9:16. Exported output video to secure App directory!');
      alert(`Vertical conversion complete! Saved to path: ${outputPath}`);
    } catch (error: any) {
      setStatusText(`Task failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI AutoReframe Studio</Text>
      <Text style={styles.subtitle}>Transform 16:9 videos into viral 9:16 TikTok layouts with smart Speaker Focus tracking</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Option A: Pick Landscape file</Text>
        <VideoPicker onVideoSelected={(uri, w, h) => setVideo({ uri, width: w, height: h, type: 'gallery' })} />
      </View>

      <Text style={styles.orText}>— OR —</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Option B: Convert YouTube Link</Text>
        <TextInput
          style={styles.input}
          placeholder="https://www.youtube.com/watch?v=..."
          placeholderTextColor="#94a3b8"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
        />
        <TouchableOpacity style={styles.linkButton} onPress={handleYoutubeSubmit}>
          <Text style={styles.btnText}>Apply Online Source</Text>
        </TouchableOpacity>
      </View>

      {video && (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewHeading}>Stream Configuration Selected</Text>
          <Text style={styles.reviewText}>Source: {video.type === 'youtube' ? 'YouTube Cloud Resource' : 'Native Device Directory'}</Text>
          <Text style={styles.reviewText}>Original Frame: {video.width} x {video.height} px (Landscape 1.77)</Text>
          
          <TouchableOpacity 
            style={[styles.reframeBtn, isProcessing && styles.btnDisabled]} 
            onPress={startReframeJob}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnTextBold}>Run 9:16 Smart Face Crop</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {statusText ? <Text style={styles.statusLabel}>{statusText}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  label: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    color: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  linkButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  orText: {
    color: '#475569',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
  },
  reviewCard: {
    backgroundColor: '#0284c715',
    borderWidth: 1,
    borderColor: '#0284c740',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  reviewHeading: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  reviewText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  reframeBtn: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#64748b',
  },
  btnTextBold: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  statusLabel: {
    color: '#10b981',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#10b98110',
    padding: 12,
    marginTop: 15,
    borderRadius: 8,
  },
});
