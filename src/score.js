import { groupBy, isEmpty, orderBy, uniqBy } from 'lodash';

import { handleError } from './utils/errorHandler';
import fileUtil from './utils/fileUtil';

export async function score(filename, callback) {
  try {
    const scoresRawInput = await fileUtil.readFile(filename);
    // Remove new line split the scores into an array
    const scoresArr = scoresRawInput.split('\r\n');
    let scoreBoard = getAllTeams(scoresRawInput);

    let finalTeamScores = [];
    let matchResults = [];

    for (let i = 0; i < scoresArr.length; i++) {
      const resultArr = scoresArr[i];
      const eachResultArr = resultArr.split(',');

      for (let j = 0; j < eachResultArr.length; j++) {
        // We want to return an object containing 2 keys, a team and score
        const team1 = toObject(eachResultArr[j]);
        const team2 = toObject(eachResultArr[j + 1]);

        matchResults.push({ team1, team2 });
        break;
      }
    }

    // Increment scores
    const eachMatchScore = incrementScore(matchResults, scoreBoard);

    // We want to order teams by score, highest to lowest
    const finalLeaderBoard = leaderBoard(orderBy(eachMatchScore, 'score', 'desc'));
    callback(finalLeaderBoard);
  } catch (error) {
    handleError(error);
  }
}

// Extract the last number in a string
export function extractScore(str) {
  return Number(str.match(/(\d+)(?!.*\d)/, '')[0]);
}

export function toObject(input) {
  const score = extractScore(input);

  // return team name and remove spaces
  const team = input.replace(score, '').trim();
  return { team, score };
}

export function scoreDecider(team1, team2) {
  if (team1.score === team2.score) {
    return [
      { team: team1.team, score: 1 },
      { team: team2.team, score: 1 },
    ];
  } else if (team1.score > team2.score) {
    return [{ team: team1.team, score: 3 }];
  } else if (team2.score > team1.score) {
    return [{ team: team2.team, score: 3 }];
  }
}

// This will help us get unique team and default scores
export function getAllTeams(teamsArr) {
  // We want to get all the team names
  const teamsScoresArr = teamsArr.replace(/\r\n/g, ',').split(',');
  const teams = teamsScoresArr.map((team) => {
    return { team: team.replace(extractScore(team), '').trim(), score: 0 };
  });
  // Get all teams and remove duplicates
  return uniqBy(teams, 'team');
}

export function incrementScore(results, scoreboard) {
  let scoreLeader;
  results.forEach((team) => {
    const scoreResults = scoreDecider(team.team1, team.team2);
    scoreResults.forEach((scoreResult) => {
      for (let i = 0; i < scoreboard.length; i++) {
        // Upade scoreboard
        if (scoreResult.team.includes(scoreboard[i].team)) {
          scoreboard[i].score += scoreResult.score;
        }
        // Jump to the next score result
        continue;
      }
    });
  });
  return scoreboard;
}

export function leaderBoard(scoreboard) {
  let finalScores = [];
  // Group by score
  const groupedScores = groupBy(scoreboard, 'score');
  let counter = 0;

  // Get scores key for each group
  // So that we can loop though each score in that group
  const keys = Object.keys(groupedScores);

  for (let i = keys.length - 1; i >= 0; i--) {
    const scoreGroup = groupedScores[keys[i]];

    for (let j = 0; j < scoreGroup.length; j++) {
      const currEachGroupScore = scoreGroup[j];

      // we want to keep track of the previous value,
      // so that we can use it's count if has same score as current
      const prevEachGroupScore = scoreGroup[j - 1];

      const logScoreResults = ` ${currEachGroupScore.team} ${currEachGroupScore.score} pts`;

      if (prevEachGroupScore) {
        if (!isEmpty(prevEachGroupScore)) {
          Object.assign(prevEachGroupScore, { prevCount: counter });
        }
        // Destructure previous score
        const { prevCount } = scoreGroup[0];
        const logResults = `${prevCount ? prevCount : counter}${logScoreResults}`;
        finalScores.push(logResults);

        // Keep incrementing this for other score groups
        counter++;
      } else {
        counter++;
        const logResults = `${counter}${logScoreResults}`;
        finalScores.push(logResults);
      }
    }
  }

  return finalScores;
}
