import client from "./client";
import type { ApiResponse, Subject, Topic, SubTopic } from "../types/api";

export const getSubjects = () => {
  return client.get<never, ApiResponse<Subject[]>>("/subjects");
};

export const getTopicsBySubject = (subjectId: string) => {
  return client.get<never, ApiResponse<Topic[]>>(
    `/topics/subject/${subjectId}`,
  );
};

export const getSubTopicsByTopic = (topicId: string) => {
  return client.get<never, ApiResponse<SubTopic[]>>(
    `/sub-topics/topic/${topicId}`,
  );
};
