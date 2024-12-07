import { Attestations } from "./attestations";
// The Algorithm.
// This is the space to design your reputation algorithm taking in account 
// multiple schemas across true network to calculate a reputation score for
// your users & the community. 

// This is the starting point, calc function.
// Algorithm Compute Module (ACM) uses this as starting point to execute
// your reputation algorithm and expects an i64 as result.
export function calc(): i64 {
  const github = Attestations.githubSchema;
  const linkedin = Attestations.linkedInSchema;
  // const x = Attestations.xSchema;

  github.commitCount * 103 + x.averageEngagementRate - 
  return 0;
}
