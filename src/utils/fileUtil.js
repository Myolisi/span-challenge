import { promises as fsAsync } from 'fs';
import path from 'path';
import { handleError } from './errorHandler';

async function readFile(filePath) {
  try {
    // If a filename does not include an extension then we append .txt
    const file = !filePath.includes('.') ? `${filePath}.txt` : filePath;

    if (file.endsWith('.txt')) {
      return await fsAsync.readFile(pathUtil(file), 'utf8');
    } else {
      throw new Error('Expected a text file');
    }
  } catch (error) {
    handleError(error);
  }
}

function pathUtil(file) {
  // default location is the assets folder
  return path.join(__dirname, '..\\..\\assets', file);
}

export default { readFile };
