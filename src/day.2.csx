using System;
using System.Collections.Generic;
using System.IO;

var P1Scoring = new Dictionary<string, int> {
    { "A X", 3 + 1 },
    { "A Y", 6 + 2 },
    { "A Z", 0 + 3 },
    { "B X", 0 + 1 },
    { "B Y", 3 + 2 },
    { "B Z", 6 + 3 },
    { "C X", 6 + 1 },
    { "C Y", 0 + 2 },
    { "C Z", 3 + 3 },
};

var P2Scoring = new Dictionary<string, int> {
    { "A X", 0 + 3 },
    { "A Y", 3 + 1 },
    { "A Z", 6 + 2 },
    { "B X", 0 + 1 },
    { "B Y", 3 + 2 },
    { "B Z", 6 + 3 },
    { "C X", 0 + 2 },
    { "C Y", 3 + 3 },
    { "C Z", 6 + 1 },
};

int GetTotalScore(StreamReader reader, Dictionary<string, int> scoring)
{
    var totalScore = 0;

    string round;

    while ((round = reader.ReadLine()) != null)
    {
        totalScore += scoring[round];
    }

    return totalScore;
}

using (var stream = new FileStream("./src/day.2.input.txt", FileMode.Open, FileAccess.Read, FileShare.Read))
using (var reader = new StreamReader(stream))
{
    var part1 = GetTotalScore(reader, P1Scoring);

    stream.Seek(0, SeekOrigin.Begin);

    var part2 = GetTotalScore(reader, P2Scoring);

    Console.WriteLine($"Part 1: {part1}\nPart 2: {part2}");
}
