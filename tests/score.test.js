import { extractScore, leaderBoard, scoreDecider, toObject } from '../src/score';

// Test extractScore()
test('Should extract a number in the last index of a string', () => {
  const scores = ['Juventus 3', 'Chelsea 3', 'Liverpool 1'];
  const expected = [3, 3, 1];
  const scoreBoard = [];

  scores.forEach((score) => {
    scoreBoard.push(extractScore(score));
  });

  expect(scoreBoard).toEqual(expect.arrayContaining(expected));
});

// Test scoreDecider()
test('should return scores based on the criteria', () => {
  const testData = [
    [
      { team: 'Chelsea', score: 3 },
      { team: 'Juventus', score: 3 },
    ], //draw
    [
      { team: 'Chelsea', score: 1 },
      { team: 'Juventus', score: 3 },
    ], //loss
    [
      { team: 'Chelsea', score: 3 },
      { team: 'Juventus', score: 1 },
    ], //win
  ];

  const expected = [
    [
      { team: 'Chelsea', score: 1 },
      { team: 'Juventus', score: 1 },
    ],

    [{ team: 'Juventus', score: 3 }],
    ,
    [{ team: 'Chelsea', score: 3 }],
  ];

  let results = [];
  for (let i = 0; i < testData.length; i++) {
    const test = testData[i];
    results.push(scoreDecider(test[0], test[1]));
  }

  //I want to test the whole score board with exected results
  expect(results).toStrictEqual(expect.arrayContaining(expected));
});

// Test leaderBoard()
test('should return the log standings in order ', () => {
  const testData = [
    { team: 'Bayern Munich', score: 4 },
    { team: 'Juventus', score: 3 },
    { team: 'Bayer Munich', score: 3 },
    { team: 'Real Madrid', score: 1 },
    { team: 'Liverpool', score: 1 },
    { team: 'Paris Saint-Germain', score: 1 },
    { team: 'Chelsea', score: 0 },
    { team: 'Arsenal', score: 0 },
    { team: 'Barcelona', score: 0 },
  ];

  const expected = ['1 Bayern Munich 4 pts', '2 Juventus 3 pts', '2 Bayer Munich 3 pts', '4 Real Madrid 1 pts', '4 Liverpool 1 pts', '4 Paris Saint-Germain 1 pts', '7 Chelsea 0 pts', '7 Arsenal 0 pts', '7 Barcelona 0 pts'];

  expect(leaderBoard(testData)).toEqual(expected);
});

// Test extractScore()
test('should should return the last digit number in a string', () => {
  const teamScore = ' Paris Saint-Germain 1';

  expect(toObject(teamScore)).toStrictEqual({ team: 'Paris Saint-Germain', score: 1 });
});
