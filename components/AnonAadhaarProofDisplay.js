import { AnonAadhaarProof } from "@anon-aadhaar/react";

const AnonAadhaarProofDisplay = ({ proof }) => {
  return (
    <div>
      <h3>Proof:</h3>
      <pre>{JSON.stringify(proof, null, 2)}</pre>
    </div>
  );
};

export default AnonAadhaarProofDisplay;
