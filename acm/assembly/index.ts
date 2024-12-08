import { Attestations } from "./attestations";

// Reputation Calculation Function
export function calc(): i64 {
  // Extract schemas
  const githubSchema = Attestations.githubSchema;
  const linkedInSchema = Attestations.linkedInSchema;

  // GitHub Score Calculation with Detailed Subscore Weighting
  const githubScoreComponents = {
    repositoryImpact: (
      (githubSchema.repoCount / 50) * 0.2 +  // Repo quantity
      (githubSchema.starsReceived / 100) * 0.25 +  // Repository popularity
      (githubSchema.externalPullRequests / 20) * 0.25  // Contribution quality
    ) * 100,

    technicalProficiency: (
      (githubSchema.languageCount / 10) * 0.2 +  // Language diversity
      (githubSchema.commitQualityScore) * 0.3 +  // Commit quality
      (githubSchema.commitCount / 1000) * 0.2  // Commit consistency
    ) * 100,

    socialProof: (
      (githubSchema.followers / 500) * 1.0  // GitHub social influence
    ) * 100
  };

  const githubCompositeScore = (
    githubScoreComponents.repositoryImpact * 0.4 +
    githubScoreComponents.technicalProficiency * 0.4 +
    githubScoreComponents.socialProof * 0.2
  );

  // LinkedIn Score Calculation with Detailed Subscore Weighting
  const linkedInScoreComponents = {
    professionalNetwork: (
      (linkedInSchema.connectionCount / 500) * 0.3 +  // Network size
      (linkedInSchema.skillEndorsements / 50) * 0.2  // Skill validation
    ) * 100,

    professionalExperience: (
      (linkedInSchema.totalWorkExperience / 15) * 0.4 +  // Work duration
      (linkedInSchema.recommendationCount / 20) * 0.3  // Professional endorsements
    ) * 100,

    professionalEngagement: (
      linkedInSchema.postEngagementScore * 0.4 +  // Post interaction
      (linkedInSchema.postingFrequencyScore) * 0.3 +  // Content consistency
      (linkedInSchema.activityScore) * 0.3  // Overall profile dynamism
    ) * 100
  };

  const linkedInCompositeScore = (
    linkedInScoreComponents.professionalNetwork * 0.3 +
    linkedInScoreComponents.professionalExperience * 0.4 +
    linkedInScoreComponents.professionalEngagement * 0.3
  );

  // Final Reputation Score Calculation
  // 60% GitHub, 40% LinkedIn weighted composition
  const reputationScore = (
    (githubCompositeScore * 0.6) + 
    (linkedInCompositeScore * 0.4)
  );

  // Additional Scoring Modifiers
  const normalizedScore = Math.min(Math.max(reputationScore, 0), 1000);

  // Convert to i64 for return
  return normalizedScore as i64;
}