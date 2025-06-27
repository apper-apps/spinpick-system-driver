import { Howl } from 'howler';

class SoundService {
  constructor() {
    this.sounds = {};
    this.initialized = false;
    this.init();
  }

  init() {
    try {
// Spin sound - a gentle whoosh/whirring sound
      this.sounds.spin = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmsoAS18z/DfkzwNH2+2/7JfAhlpuvT4t3MhCSSO2OfUfSUFLIHO8tmOPgkZZLrr46JRDwlFo+HwulwkBTKB0O3UnzkaE2e39vWtZBwGOJPZ6tKEKgUre8P13ZY9ABxru+7hq1ghBzSAz+/dmU4BD2m86eWnWRgMRJ7h8bJdGB8tdM/g3IsjBi16zvfakTwQHGm86+KkUQ0JRJ7h87BeGAUtedHx3pA7DBppvOvhpVEOCkSc4fC0XhwGLXrN89uNOAgVZbvo4KNTEglEnOHxtF8cBS160vHejzwMGmi76+KmUQ0ISp3i8LReHAUtet3v3Y4+CBZlu+jhpVIOCkSc4fGzXxoHLXnT8t6NPQkYZ7rq4qVTDgpDnuHws14cBi1608b5YSMAAXjH8t6POwoZZrns4qJSDwlGn+LwtWMcBzWB0vHdkj4IGGi67eGnVBAKRJ7g8bNfGgYuetLx3o48CRhnu+zio1MOCkSe4fGzXxwGLXrT8t6NPQkYZ7rq4qVTDgpDnuHws14cBi1608b8XS0BAXjH8t6POwoZZrns4qJSDwlGn+LwtWMcBzWB0vHdkj4IGGi67eGnVBAKRJ7g8bNfGgYuetLx3o48CRhnu+zio1MOCkSe4fGzXxwGLXrT8t6NPQkYZ7rq4qVTDgpDnuHws14cBi1608'],
        volume: 0.3,
        loop: false,
        preload: true,
        html5: false
      });

      // Winner sound - a celebratory chime/bell sound
      this.sounds.winner = new Howl({
        src: ['data:audio/wav;base64,UklGRlQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTAEAAA9qwAAZuAAAHXrAAB+8gAAfvEAAHLmAABd1wAAQqsAAB6EAAABXAAAATcAABVLAAAvdwAAWZ0AAISfAAChowAAqKEAAJOYAABpeAAAN0YAAAtJAAAJSQAAHWIAAD+HAAB6lQAAsp0AAMygAAC5oQAAhIkAAElOAAAdKgAAESEAABsgAAArOwAAQFMAAFhhAABpXwAAcVwAAG9QAABhQAAAUD8AAEJKAABFWQAAaX8AAKyhAADKqAAAyqIAAJ+SAABnbwAAOEsAABc0AAACHgAABSIAAAorAAATQgAALl8AAGOGAAClowAAz7IAAPqsAAC2nQAAaHwAADNEAAAcNQAABCEAAAMfAAARKgAAJUEAADpgAABcgwAAn54AAMe0AADntwAAr6IAAGt8AAA0QgAAGCsAAAgfAAACHQAACSUAABk7AAArVAAAXXkAAJ+ZAADDsAAA6bcAALGiAABofwAAM0MAABkuAAAKIQAABB4AAAgjAAAXOgAAKlMAAF14AACemoAAw7EAAOm5AAC0pAAAanwAADM/AAAbLgAADSEAAAYeAAAIIgAAFjgAACtRAABddwAAn5cAAMOwAADpsQAAsa0AAGqAAAA2RAAAR4oAAFGjAABOrwAANJEAAB5mAAAOPgAABSkAAAMgAAAKJgAAGz4AADFXAABmhwAAqKIAAM6yAADxtQAAuqIAAHOAAABBTAAAJzIAAA8kAAAGHgAACCEAABczAAAlSAAAUGoAAI+SAACxqAAA170AAMumAAB4fQAAQkgAACA8AAAPKgAABSQAAAs0AAAfTgAAOF8AAGqEAAChngAAyKwAAO20AADCnAAAcnwAADg6AAATMgAACSoAAAUrAAAQOgAALVEAAF5yAACUkAAAqZ8AALuhAADLkgAAenoAADg5AAATMQAACCkAAAUsAAAQOwAALVIAAF1xAACSkAAAqZ4AALugAADJkQAAeXkAADY2AAARLwAAByoAAAYuAAAROAAuUGAAWngAAI2NAAChngAAurIAAMqWAAB+fgAAOzoAABMyAAAKKAAACCkAABQ6AAAxTgAAYW4AAJKMAAComoAAurMAAMqWAAB+fgAAOzsAABMyAAAKKAAAECgAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzsAABMyAAAKKAAABygAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzsAABMyAAAKKAAABygAABU5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzsAABMyAAAKKAAABygAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzsAABMyAAAKKAAABygAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJKLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQAABygAABQ5AAAxTQAAYW0AAJOLAAComoAAurMAAMqWAAB+fgAAOzoAABMyAAAKKQ=='],
        volume: 0.4,
        loop: false,
        preload: true,
        html5: false
      });

      this.initialized = true;
    } catch (error) {
      console.warn('Sound initialization failed:', error);
      this.initialized = false;
    }
  }

  playSpinSound() {
    if (!this.initialized || !this.sounds.spin) {
      return;
    }

    try {
      this.sounds.spin.play();
    } catch (error) {
      console.warn('Failed to play spin sound:', error);
    }
  }

  playWinnerSound() {
    if (!this.initialized || !this.sounds.winner) {
      return;
    }

    try {
      this.sounds.winner.play();
    } catch (error) {
      console.warn('Failed to play winner sound:', error);
    }
  }

  setVolume(soundName, volume) {
    if (!this.initialized || !this.sounds[soundName]) {
      return;
    }

    try {
      this.sounds[soundName].volume(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.warn(`Failed to set volume for ${soundName}:`, error);
    }
  }

  stopAll() {
    if (!this.initialized) {
      return;
    }

    try {
      Object.values(this.sounds).forEach(sound => {
        if (sound && sound.stop) {
          sound.stop();
        }
      });
    } catch (error) {
      console.warn('Failed to stop sounds:', error);
    }
  }
}

// Create and export singleton instance
const soundService = new SoundService();
export default soundService;