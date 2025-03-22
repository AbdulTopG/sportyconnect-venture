
import React from 'react';
import { useCreateMatchForm } from '@/hooks/use-create-match-form';
import SportTypeField from './SportTypeField';
import LocationField from './LocationField';
import DateTimeFields from './DateTimeFields';
import TeamSizeField from './TeamSizeField';
import SkillLevelField from './SkillLevelField';
import DescriptionField from './DescriptionField';
import SubmitButton from './SubmitButton';
import StatusAlerts from './StatusAlerts';

const CreateMatchForm: React.FC = () => {
  const {
    formData,
    isSubmitting,
    createSuccess,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit,
    user
  } = useCreateMatchForm();

  return (
    <div className="sportyfi-container max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Host a Match</h1>
      
      <StatusAlerts 
        isLoggedIn={!!user} 
        createSuccess={createSuccess} 
      />
      
      <form onSubmit={handleSubmit} className="space-y-6 sportyfi-card">
        <SportTypeField 
          onValueChange={(value) => handleSelectChange('sport', value)} 
        />
        
        <LocationField 
          value={formData.location} 
          onChange={handleChange} 
        />
        
        <DateTimeFields 
          date={formData.date} 
          time={formData.time} 
          onDateChange={handleDateChange} 
          onTimeChange={handleChange} 
        />
        
        <TeamSizeField 
          onValueChange={(value) => handleSelectChange('teamSize', value)} 
        />
        
        <SkillLevelField 
          defaultValue={formData.skillLevel}
          onValueChange={(value) => handleSelectChange('skillLevel', value)} 
        />
        
        <DescriptionField 
          value={formData.description} 
          onChange={handleChange} 
        />
        
        <SubmitButton 
          isSubmitting={isSubmitting} 
          isSuccess={createSuccess} 
        />
      </form>
    </div>
  );
};

export default CreateMatchForm;
