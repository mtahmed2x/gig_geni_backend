import { QuestionType } from "../quizQuestion/quizQuestion.constant";

export type QuizAnswerValue =
  | { type: QuestionType.Single; value: string }
  | { type: QuestionType.Multiple; value: string[] }
  | { type: QuestionType.TrueFalse; value: boolean }
  | { type: QuestionType.Short; value: string }
  | { type: QuestionType.Broad; value: string };
