import { playNotificationSound } from '@/utils/audioUtils';

type OffscreenMessage = {
  target?: string;
  type?: string;
};

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
  if (
    message?.target === 'offscreen' &&
    message?.type === 'play-break-end-sound'
  ) {
    playNotificationSound();
  }
});
