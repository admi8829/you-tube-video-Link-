import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import { KeyframeData } from '../screens/types';
import * as FileSystem from 'expo-file-system';

/**
 * Multi-frame dynamic crop logic. Compiles MLKit focal vectors
 * into continuous FFmpeg command options to slide the 9:16 viewport safely.
 */
export const reframeVideo = async (
  videoUri: string,
  keyframes: KeyframeData[],
  originalWidth: number,
  originalHeight: number
): Promise<string> => {
  const targetHeight = originalHeight;
  const targetWidth = Math.round(originalHeight * (9 / 16));
  const outputPath = `${FileSystem.cacheDirectory}cropped_vertical_video.mp4`;

  let xExpression = `${originalWidth / 2 - targetWidth / 2}`; // Default center fallback

  if (keyframes.length > 0) {
    let fallback = `${originalWidth / 2 - targetWidth / 2}`;
    
    xExpression = keyframes.slice().reverse().reduce((acc, kf, index) => {
      const idealX = kf.focalPointX - targetWidth / 2;
      const boundedX = Math.max(0, Math.min(originalWidth - targetWidth, idealX));
      
      if (index === 0) {
        return `${boundedX}`;
      }
      return `if(lt(t,${kf.timeInSec}),${boundedX},${acc})`;
    }, fallback);
  }

  const ffmpegFilterGraph = `crop=w=${targetWidth}:h=${targetHeight}:x='${xExpression}'`;
  const command = `-y -i "${videoUri}" -vf "${ffmpegFilterGraph}" -c:v libx264 -preset ultrafast -crf 23 -c:a copy "${outputPath}"`;

  console.log('Triggering FFmpeg session with params: ', command);

  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return outputPath;
  } else {
    const state = await session.getState();
    const failStackTrace = await session.getFailStackTrace();
    throw new Error(`FFmpeg transaction failed with state ${state}: ${failStackTrace}`);
  }
};
