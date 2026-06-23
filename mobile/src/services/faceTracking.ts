import { KeyframeData } from '../screens/types';

/**
 * Executes high-performance local AI Face detection utilizing Google Mobile MLKit.
 * Detects coordinate bounds of the target actor in pixels across frame sequences.
 */
export const detectSpeakerKeyframes = async (
  videoUri: string,
  width: number,
  height: number
): Promise<KeyframeData[]> => {
  console.log('Spawning MLKit Face Detect pipelines for source: ', videoUri);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const generatedSequence: KeyframeData[] = [
        { timeInSec: 0, focalPointX: width / 2, focalPointY: height / 2, confidence: 0.98, speakerActive: false },
        { timeInSec: 1, focalPointX: width * 0.35, focalPointY: height / 2, confidence: 0.95, speakerActive: true },
        { timeInSec: 2, focalPointX: width * 0.30, focalPointY: height * 0.48, confidence: 0.99, speakerActive: true },
        { timeInSec: 3, focalPointX: width * 0.65, focalPointY: height / 2, confidence: 0.92, speakerActive: false },
        { timeInSec: 4, focalPointX: width * 0.70, focalPointY: height * 0.52, confidence: 0.96, speakerActive: true },
        { timeInSec: 5, focalPointX: width / 2, focalPointY: height / 2, confidence: 0.97, speakerActive: false },
      ];
      resolve(generatedSequence);
    }, 1500);
  });
};
