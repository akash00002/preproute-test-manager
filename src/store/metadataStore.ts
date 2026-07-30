import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic,
} from "../api/subjects";
import type { Subject, Topic, SubTopic } from "../types/api";

interface MetadataState {
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  subTopicsByTopic: Record<string, SubTopic[]>;

  fetchSubjects: () => Promise<void>;
  fetchTopics: (subjectId: string) => Promise<void>;
  fetchSubTopics: (topicId: string) => Promise<void>;
}

export const useMetadataStore = create<MetadataState>()(
  persist(
    (set, get) => ({
      subjects: [],
      topicsBySubject: {},
      subTopicsByTopic: {},

      fetchSubjects: async () => {
        if (get().subjects.length > 0) return;

        const res = await getSubjects();

        set({
          subjects: res.data,
        });
      },

      fetchTopics: async (subjectId) => {
        if (get().topicsBySubject[subjectId]) return;

        const res = await getTopicsBySubject(subjectId);

        set((state) => ({
          topicsBySubject: {
            ...state.topicsBySubject,
            [subjectId]: res.data,
          },
        }));
      },

      fetchSubTopics: async (topicId) => {
        if (get().subTopicsByTopic[topicId]) return;

        const res = await getSubTopicsByTopic(topicId);

        set((state) => ({
          subTopicsByTopic: {
            ...state.subTopicsByTopic,
            [topicId]: res.data,
          },
        }));
      },
    }),
    {
      name: "metadata-storage",
    },
  ),
);
