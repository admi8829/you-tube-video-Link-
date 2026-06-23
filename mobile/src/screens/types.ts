export interface KeyframeData {
  timeInSec: number;
  focalPointX: number; // Pixels from left edge in original video width
  focalPointY: number; // Pixels from top edge in original video height
  confidence: number; // 0.0 to 1.0 likelihood score
  speakerActive: boolean; // True if audio amplitude correlates to movement
}
