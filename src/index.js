import { score } from './score';
import { forEach, values } from 'lodash';

// Get filename from the run script
const inputFile = process.argv[2];

if (process.argv[2]) {
  score(process.argv[2], (results) => {
    // Display all team standings
    results.forEach((team) => console.log(team));
  });
} else if (inputFile === '/' || !inputFile) {
  console.warn({
    message: 'Please pass a file name',
  });
}
