import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { calculateOdds, OddsResult } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Dice = {
  value: number | null;
  index: number;
};

function App() {
  const [attackerValues, setAttackerValues] = useState<Dice[]>([
    { value: 1, index: 0 },
    { value: null, index: 1 },
    { value: null, index: 2 },
  ]);

  const handleAttackerValueChange = (index: number, value: string) => {
    let newValues = [...attackerValues];
    newValues[index] = {
      value: value === "not-thrown" ? null : Number(value),
      index: index,
    };
    setAttackerValues(newValues);
  };

  const activeAttackerDice = attackerValues
    .filter((dice) => dice.value !== null)
    .map((dice) => dice.value as number);

  const oneDefenderOdds = calculateOdds(activeAttackerDice, 1);
  const twoDefenderOdds = calculateOdds(activeAttackerDice, 2);

  // Calculate expected unit differences
  const oneDefenderExpectedDiff = oneDefenderOdds
    ? {
        attacker: (-1 * oneDefenderOdds.attackerLoosesAll) / 100,
        defender: (-1 * oneDefenderOdds.defenderLoosesAll) / 100,
      }
    : null;

  const twoDefenderExpectedDiff = twoDefenderOdds
    ? {
        attacker:
          (-2 * twoDefenderOdds.attackerLoosesAll -
            twoDefenderOdds.eachLooseOne) /
          100,
        defender:
          (-2 * twoDefenderOdds.defenderLoosesAll -
            twoDefenderOdds.eachLooseOne) /
          100,
      }
    : null;

  const ResultCard = ({
    title,
    odds,
    expectedDiff,
  }: {
    title: string;
    odds: OddsResult | null;
    expectedDiff:
      | typeof oneDefenderExpectedDiff
      | typeof twoDefenderExpectedDiff;
  }) => (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Outcome</TableHead>
            <TableHead className="text-right">Probability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Defender loses all</TableCell>
            <TableCell className="text-right">
              {odds?.defenderLoosesAll + " %"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attacker loses all</TableCell>
            <TableCell className="text-right">
              {odds?.attackerLoosesAll + " %"}
            </TableCell>
          </TableRow>
          {odds?.eachLooseOne !== undefined && (
            <TableRow>
              <TableCell>Each loses one</TableCell>
              <TableCell className="text-right">
                {odds?.eachLooseOne + " %"}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-semibold">
              Expected unit change
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attacker</TableCell>
            <TableCell className="text-right font-medium text-red-500">
              {expectedDiff?.attacker.toFixed(2) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Defender</TableCell>
            <TableCell className="text-right font-medium text-blue-500">
              {expectedDiff?.defender.toFixed(2) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Delta</TableCell>
            <TableCell className="text-right font-medium">
              <span
                className={
                  (expectedDiff?.defender ?? 0) -
                    (expectedDiff?.attacker ?? 0) >
                  0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {(
                  (expectedDiff?.defender ?? 0) - (expectedDiff?.attacker ?? 0)
                ).toFixed(2)}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Loss ratio (A:D)</TableCell>
            <TableCell className="text-right font-medium">
              1:
              {(
                Math.round(
                  ((expectedDiff?.defender ?? 0) /
                    (expectedDiff?.attacker ?? 0)) *
                    100
                ) / 100
              ).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">
        Risiko Dice Calculator
      </h1>
      <div className="space-y-4 w-full max-w-2xl">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="mt-2 space-y-2">
                {attackerValues.map((dice, index) => (
                  <div key={`attacker-value-${index}`} className="space-y-1">
                    <Label htmlFor={`attacker-value-${index}`}>
                      Attacker Die {index + 1} Value
                    </Label>
                    <Select
                      value={dice.value?.toString() ?? "not-thrown"}
                      onValueChange={(v) => handleAttackerValueChange(index, v)}
                    >
                      <SelectTrigger id={`attacker-value-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                        {index > 0 && (
                          <SelectItem value="not-thrown">Not thrown</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <ResultCard
          title="With 1 Defender Die"
          odds={oneDefenderOdds}
          expectedDiff={oneDefenderExpectedDiff}
        />

        {activeAttackerDice.length >= 2 && (
          <ResultCard
            title="With 2 Defender Dice"
            odds={twoDefenderOdds}
            expectedDiff={twoDefenderExpectedDiff}
          />
        )}
      </div>
    </div>
  );
}

export default App;
