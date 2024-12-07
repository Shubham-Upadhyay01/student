import { Hash, Schema, U32, U64, F32, F64, Text } from "@truenetworkio/sdk";

// GitHub Schema
export const githubSchema = Schema.create({
  username: Text,
  repoCount: U32,                  // Number of repositories
  commitCount: U32,                // Total number of commits
  commitQualityScore: F64,       // Grading based on commit patterns and quality
  languageCount: U32,              // Number of distinct programming languages
  externalPullRequests: U32,       // Count of pull requests merged in external repos
  starsReceived: U32,              // Total stars received across repositories
  followers: U32                   // Number of GitHub followers
});

// LinkedIn Schema
export const linkedInSchema = Schema.create({
  username: Text,
  connectionCount: U32,            // Total number of connections
  totalWorkExperience: F32,      // Total work experience in years
  postingFrequencyScore: F32,    // Frequency of posts (normalized)
  recommendationCount: U32,        // Number of recommendations received
  postEngagementScore: F32,      // Average engagement on posts (likes/comments/shares)
  skillEndorsements: U32,          // Number of endorsements on skills
  activityScore: F32             // Composite score based on profile activity
});

// X (formerly Twitter) Schema
export const xSchema = Schema.create({
  username: Text,
  tweetCount: U32,                 // Total number of tweets
  replyCount: U32,                 // Total number of replies
  likeCount: U64,                  // Total number of likes received
  followerCount: U64,              // Total number of followers
  retweetCount: U32,               // Total number of retweets received
  averageEngagementRate: F64,    // Engagement rate: (likes + replies + retweets) / followers
  tweetFrequencyScore: F64      // Posting frequency (normalized)
});
