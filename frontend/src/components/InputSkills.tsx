import React, { useState } from 'react';

interface SkillInputProps {
  initialSkills?: string[];
  value: string[];
  onChange: (skills: string[]) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ initialSkills = [], value, onChange }) => {
  const [skill, setSkill] = useState<string>('');

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skill.trim() !== '') {
      const newSkills = [...value, skill.trim()];
      onChange(newSkills); // Update parent with new skills
      setSkill(''); // Clear input
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = value.filter((s) => s !== skillToRemove);
    onChange(updatedSkills);
  };

  return (
    <div>
      <div className='skills-container'>
        {value.map((skill, index) => (
          <span key={index} className='skill-container'>
            <span className='skill-tag'>{skill}</span>
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
