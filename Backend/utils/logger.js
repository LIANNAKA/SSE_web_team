import fs from 'fs';
import path from 'path';

const logFilePath = path.join('logs', 'log.txt');

export const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;

  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

  fs.appendFile(logFilePath, entry, (err) => {
    if (err) console.error('Error writing to log file:', err.message);
  });
};
