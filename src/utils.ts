export type OddsResult = {
  eachLooseOne: number;
  defenderLoosesAll: number;
  attackerLoosesAll: number;
};

type Roll = {
  values: number[];
};

export function calculateOdds(
  attackerValues: number[],
  defenderNumberOfDice: number
) {
  // TODO: Implement odds calculation
  if (defenderNumberOfDice > attackerValues.length) {
    return null;
  }

  const n = defenderNumberOfDice;

  const _attackerValues = attackerValues.sort((a, b) => b - a).slice(0, n);

  const nPossibleRolls = Math.pow(6, n);

  const possibleRolls = [];

  for (let i = 0; i < nPossibleRolls; i++) {
    const roll = i
      .toString(6)
      .padStart(n, "0")
      .split("")
      .map((n) => Number(n) + 1);
    possibleRolls.push(roll);
  }

  const sortedPossibleRolls = possibleRolls.map((roll) =>
    [...roll].sort((a, b) => b - a)
  );

  let nDefenderLoosesAll = 0;
  let nAttackerLoosesAll = 0;
  let nEachLooseOne = 0;

  if (n === 1) {
    nDefenderLoosesAll = sortedPossibleRolls.filter(
      (roll) => roll[0] < _attackerValues[0]
    ).length;
    nAttackerLoosesAll = sortedPossibleRolls.filter(
      (roll) => roll[0] >= _attackerValues[0]
    ).length;
    nEachLooseOne = 0;
  }

  if (n === 2) {
    nDefenderLoosesAll = sortedPossibleRolls.filter(
      (roll) => roll[0] < _attackerValues[0] && roll[1] < _attackerValues[1]
    ).length;
    nAttackerLoosesAll = sortedPossibleRolls.filter(
      (roll) => roll[0] >= _attackerValues[0] && roll[1] >= _attackerValues[1]
    ).length;
    nEachLooseOne = nPossibleRolls - nDefenderLoosesAll - nAttackerLoosesAll;
  }

  const result: OddsResult = {
    eachLooseOne: Math.round((nEachLooseOne / nPossibleRolls) * 10000) / 100,
    defenderLoosesAll:
      Math.round((nDefenderLoosesAll / nPossibleRolls) * 10000) / 100,
    attackerLoosesAll:
      Math.round((nAttackerLoosesAll / nPossibleRolls) * 10000) / 100,
  };

  console.log(result);

  return result;
}
