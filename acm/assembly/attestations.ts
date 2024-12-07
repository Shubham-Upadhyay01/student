
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class GITHUBSCHEMA {
  username: undefined;
  starsReceived: u32;
  repoCount: u32;
  languageCount: u32;
  followers: u32;
  externalPullRequests: u32;
  commitQualityScore: f64;
  commitCount: u32;

  constructor() {
    this.username = readMemory<undefined>(0);
    this.starsReceived = readMemory<u32>(NaN);
    this.repoCount = readMemory<u32>(NaN);
    this.languageCount = readMemory<u32>(NaN);
    this.followers = readMemory<u32>(NaN);
    this.externalPullRequests = readMemory<u32>(NaN);
    this.commitQualityScore = readMemory<f64>(NaN);
    this.commitCount = readMemory<u32>(NaN);
  }
}


class LINKEDINSCHEMA {
  username: undefined;
  totalWorkExperience: f32;
  skillEndorsements: u32;
  recommendationCount: u32;
  postingFrequencyScore: f32;
  postEngagementScore: f32;
  connectionCount: u32;
  activityScore: f32;

  constructor() {
    this.username = readMemory<undefined>(NaN);
    this.totalWorkExperience = readMemory<f32>(NaN);
    this.skillEndorsements = readMemory<u32>(NaN);
    this.recommendationCount = readMemory<u32>(NaN);
    this.postingFrequencyScore = readMemory<f32>(NaN);
    this.postEngagementScore = readMemory<f32>(NaN);
    this.connectionCount = readMemory<u32>(NaN);
    this.activityScore = readMemory<f32>(NaN);
  }
}


class XSCHEMA {
  username: undefined;
  tweetFrequencyScore: f64;
  tweetCount: u32;
  retweetCount: u32;
  replyCount: u32;
  likeCount: u64;
  followerCount: u64;
  averageEngagementRate: f64;

  constructor() {
    this.username = readMemory<undefined>(NaN);
    this.tweetFrequencyScore = readMemory<f64>(NaN);
    this.tweetCount = readMemory<u32>(NaN);
    this.retweetCount = readMemory<u32>(NaN);
    this.replyCount = readMemory<u32>(NaN);
    this.likeCount = readMemory<u64>(NaN);
    this.followerCount = readMemory<u64>(NaN);
    this.averageEngagementRate = readMemory<f64>(NaN);
  }
}


export class Attestations {
  static githubSchema: GITHUBSCHEMA = new GITHUBSCHEMA();
  static linkedInSchema: LINKEDINSCHEMA = new LINKEDINSCHEMA();
  static xSchema: XSCHEMA = new XSCHEMA();
}
