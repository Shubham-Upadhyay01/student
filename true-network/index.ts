import { U32, U64, F32, Text } from '@truenetworkio/sdk';
import { githubSchema, linkedInSchema} from './schema'; // xSchema
import { getTrueNetworkInstance } from '../true-network/true.config';

const attestGitHubToUser = async () => {
  try {
    const api = await getTrueNetworkInstance();

    // User Wallet Addresses (Solana, Ethereum, Polkadot, etc.)
    const ethereumUserWallet = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';

    // GitHub User Data for Attestation
    const githubData = {
      username: "anirudh",
      repoCount: 9, // Number of repositories
      commitCount: 14, // Total number of commits
      commitQualityScore: 85.5, // Commit grading score (e.g., out of 100)
      languageCount: 4, // Number of distinct programming languages
      externalPullRequests: 7, // Count of pull requests merged in external repos
      starsReceived: 120, // Total stars received
      followers: 45 // GitHub followers
    };
     

    // Validate Data (Optional Step for Robustness)
    if (githubData.repoCount < 0 || githubData.commitCount < 0) {
      throw new Error("Invalid data: Repository count and commit count cannot be negative.");
    }

    const GITHUB = await githubSchema.attest(api, ethereumUserWallet, githubData);

    console.log("GitHub attestation transaction hash:", GITHUB);

    await api.network.disconnect();
  } catch (error) {
    console.error("Error during GitHub attestation:", error);
  }
};

const attestLinkedInToUser = async () => {
  try {
    const api = await getTrueNetworkInstance();

    const ethereumUserWallet = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';

    const linkedInData = {
      username: "anirudh",
      connectionCount: 500, // Total connections
      totalWorkExperience: 5.5, // Work experience in years
      postingFrequencyScore: 4.2, // Posting frequency (normalized)
      recommendationCount: 15, // Recommendations received
      postEngagementScore: 72.3, // Engagement score on posts
      skillEndorsements: 30, // Endorsements received
      activityScore: 85.7 // Overall activity score
    };

    const LINKEDIN = await linkedInSchema.attest(api, ethereumUserWallet, {
      username: linkedInData.username,
      connectionCount: (linkedInData.connectionCount),
      totalWorkExperience: (linkedInData.totalWorkExperience),
      postingFrequencyScore: (linkedInData.postingFrequencyScore),
      recommendationCount: (linkedInData.recommendationCount),
      postEngagementScore: (linkedInData.postEngagementScore),
      skillEndorsements: (linkedInData.skillEndorsements),
      activityScore: (linkedInData.activityScore)
    });

    console.log("LinkedIn attestation transaction hash:", LINKEDIN);

    await api.network.disconnect();
  } catch (error) {
    console.error("Error during LinkedIn attestation:", error);
  }
};
/*
const attestXToUser = async () => {
  try {
    const api = await getTrueNetworkInstance();

    const ethereumUserWallet = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';

    // Twitter (X) User Data for Attestation
    const xData = {
      username: "anirudh",
      tweetCount: 1200, // Total tweets
      replyCount: 150, // Total replies
      likeCount: 4500, // Total likes
      followerCount: 800, // Total followers
      retweetCount: 300, // Total retweets
      averageEngagementRate: 5.2, // Engagement rate in percentage
      tweetFrequencyScore: 3.8 // Normalized frequency score
    };

    const X = await xSchema.attest(api, ethereumUserWallet, {
      username: xData.username,
      tweetCount: (xData.tweetCount),
      replyCount: (xData.replyCount),
      likeCount: (xData.likeCount),
      followerCount: (xData.followerCount),
      retweetCount: (xData.retweetCount),
      averageEngagementRate: (xData.averageEngagementRate),
      tweetFrequencyScore: (xData.tweetFrequencyScore)
    });

    console.log("Twitter (X) attestation transaction hash:", X);

    await api.network.disconnect();
  } catch (error) {
    console.error("Error during Twitter (X) attestation:", error);
  }
};*/

// Call the functions
attestGitHubToUser();
attestLinkedInToUser();
//attestXToUser();
