import type { z } from "zod";
import { AvailabilityArraySchema } from "./Availability";
import { BasicDataSchema } from "./BasicData";
import { EducationsArraySchema } from "./Education";
import { LanguageArraySchema } from "./Language";
import { PhotoSchema } from "./Photo";
import { SystemSkillsArraySchema } from "./SystemSkill";
import { TrainingsArraySchema } from "./Training";
import { WorkExperiencesArraySchema } from "./WorkExperience";
import { GradesSchema } from "./Grades";

export const ProfileSchema = BasicDataSchema.extend({
	educations: EducationsArraySchema,
	trainings: TrainingsArraySchema,
	languages: LanguageArraySchema,
	systems: SystemSkillsArraySchema,
	workExperiences: WorkExperiencesArraySchema,
	availabilities: AvailabilityArraySchema,
	photo: PhotoSchema,
	grades: GradesSchema
});

export type ProfileType = z.infer<typeof ProfileSchema>;
