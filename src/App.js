import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Int from "./pages/Int";

import Ques from "./pages/Ques";
import Socials from "./pages/socials";
import profile from "./pages/profile";
import Profile from "./pages/profile";
import CompanyReg from './pages/companyReg';
import CompanyDashboard from "./pages/CompanyDashboard";
import SkillsDashboard from "./pages/SkillsDashboard";
import UserProfile from "./pages/UserProfile";
import SkillVerification from "./pages/ SkillVerification ";
import Verifier from "./pages/Verifier";
import VerifierDashboard from "./pages/VerifierDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Int />} />
          <Route path="/Ques" element={<Ques />} />
          <Route path="/Socials" element={<Socials />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/comp" element={<CompanyReg />} />
          <Route path="/company-dashboard" element={<CompanyDashboard/>}/>
          <Route path="/skillsdashboard" element={<SkillsDashboard/>}/>
          <Route path="/userprofile" element={<UserProfile/>}/>
          <Route path="/skillverification" element={<SkillVerification/>}/>
          <Route path="/verifier" element={<Verifier/>}/>
          <Route path="/verifierdashboard" element={<VerifierDashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
