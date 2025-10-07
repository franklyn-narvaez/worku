// src/modules/student/schemas/StudentProfile.ts
import { z } from "zod";
import { BasicDataSchema } from "./BasicData";
import { EducationsArraySchema } from "./Education";
import { TrainingsArraySchema } from "./Training";
import { LanguageArraySchema } from "./Language";
import { SystemSkillsArraySchema } from "./SystemSkill";
import { WorkExperiencesArraySchema } from "./WorkExperience";
import { AvailabilityArraySchema } from "./Availability";

export const ProfileSchema = BasicDataSchema.extend({
	educations: EducationsArraySchema,
	trainings: TrainingsArraySchema,
	languages: LanguageArraySchema,
	systems: SystemSkillsArraySchema,
	workExperiences: WorkExperiencesArraySchema,
	availabilities: AvailabilityArraySchema,
});

export type ProfileType = z.infer<typeof ProfileSchema>;
