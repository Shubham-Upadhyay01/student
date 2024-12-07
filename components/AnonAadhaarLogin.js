import { LogInWithAnonAadhaar } from "@anon-aadhaar/react";

const AnonAadhaarLogin = ({ nullifierSeed }) => {
  return (
    <div>
      <LogInWithAnonAadhaar nullifierSeed={nullifierSeed} />
    </div>
  );
};

export default AnonAadhaarLogin;
