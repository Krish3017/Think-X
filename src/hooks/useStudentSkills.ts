import { useState, useEffect } from 'react';
import axios from 'axios';

interface Skill {
  skill_name: string;
  proficiency_score: number;
  proficiency_level: string;
}

export function useStudentSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasVisitedProfile, setHasVisitedProfile] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:5000/api/student/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
      setHasVisitedProfile(true);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return { skills, loading, fetchSkills, hasVisitedProfile };
}
