import fs from 'fs';
import mkdirp from 'mkdirp';

class Settings {
  constructor(jsonPrefix, wipeOldData) {
    const DIR = (process.env.APPDATA ||
      (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')) +
      '/Nucleus';
    this.PATH = `${DIR}/${(jsonPrefix || '')}.settings.json`;
    this.data = {};
    this.lastSync = 0;

    if (fs.existsSync(this.PATH) && !wipeOldData) {
      this._load();
    } else {
      mkdirp(DIR);
    }
    this.coupled = true;
  }

  uncouple() {
    this.coupled = false;
  }

  get(key, defaultValue = null) {
    if (!this.coupled) {
      this._load();
    }
    return this.data[key] || defaultValue;
  }

  set(key, value) {
    if (this.coupled) {
      this.data[key] = value;
      this._save();
    }
  }

  _load() {
    this.data = JSON.parse(fs.readFileSync(this.PATH, 'utf8'));
  }

  _save(force) {
    const now = (new Date).getTime();
    // During some save events (like resize) we need to queue the disk writes
    // so that we don't blast the disk every millisecond
    if (now - this.lastSync > 250 || force) {
      fs.writeFileSync(this.PATH, JSON.stringify(this.data));
    } else {
      if (this.saving) clearTimeout(this.saving);
      this.saving = setTimeout(this._save.bind(this), 275);
    }
    this.lastSync = now;
  }
}

export default Settings;
