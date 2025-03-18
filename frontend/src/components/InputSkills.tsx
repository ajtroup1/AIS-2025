import React, { useState } from 'react';

interface SkillInputProps {
  initialSkills?: string[];
}

const SkillInput: React.FC<SkillInputProps> = ({ initialSkills = [] }) => {
  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<string[]>(initialSkills);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skill.trim() !== '') {
      setSkills((prevSkills) => [...prevSkills, skill.trim()]);
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div>
      <div className='skills-container'>
        {skills.map((skill, index) => (
          <span key={index} className='skill-container'>
            <span className='skill-tag'>
                {skill}
            </span>
            <div className='skill-remove' onClick={() => handleRemoveSkill(skill)}>x</div>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder="Enter skill and press Enter"
        className='skill-input-field'
      />
    </div>
  );
};

export default SkillInput;