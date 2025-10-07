import { z } from "zod";
import { BasicDataSchema } from "./BasicDataSchema";
import { EducationsArraySchema } from "./EducationSchema";
import { TrainingsArraySchema } from "./TrainingSchema";
import { LanguageArraySchema } from "./LanguageSchema";
import { SystemSkillsArraySchema } from "./SystemSkillSchema";
import { WorkExperiencesArraySchema } from "./WorkExperienceSchema";
import { AvailabilityArraySchema } from "./AvailabilitySchema";

export const ProfileSchema = BasicDataSchema.extend({
	educations: EducationsArraySchema,
	trainings: TrainingsArraySchema,
	languages: LanguageArraySchema,
	systems: SystemSkillsArraySchema,
	workExperiences: WorkExperiencesArraySchema,
	availabilities: AvailabilityArraySchema,
});

export type ProfileType = z.infer<typeof ProfileSchema>;
