import { z } from "zod";
import { BasicDataSchema } from "./BasicDataSchema";
import { EducationsArraySchema } from "./EducationSchema";
import { TrainingsArraySchema } from "./TrainingSchema";
import { LanguageArraySchema } from "./LanguageSchema";
import { SystemSkillsArraySchema } from "./SystemSkillSchema";
import { WorkExperiencesArraySchema } from "./WorkExperienceSchema";
import { AvailabilityArraySchema } from "./AvailabilitySchema";
import { PhotoSchema } from "./PhotoSchema";
import { GradeSchema } from "./GradeSchema";

export const ProfileSchema = BasicDataSchema.extend({
	educations: EducationsArraySchema,
	trainings: TrainingsArraySchema,
	languages: LanguageArraySchema,
	systems: SystemSkillsArraySchema,
	workExperiences: WorkExperiencesArraySchema,
	availabilities: AvailabilityArraySchema,
	photo: PhotoSchema,
	grades: GradeSchema,
});

export type ProfileType = z.infer<typeof ProfileSchema>;
