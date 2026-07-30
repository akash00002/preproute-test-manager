import { useEffect, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import {
  getSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic,
} from "../api/subjects";
import type { Subject, Topic, SubTopic } from "../types/api";

interface CascadeFormValues {
  topics: string;
  sub_topics?: string;
}

export function useTestFormCascade<T extends CascadeFormValues>(
  selectedSubject: string | undefined,
  selectedTopic: string | undefined,
  setValue: UseFormSetValue<T>,
) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  const [topicsLoading, setTopicsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState<string | null>(null);

  const [prevSubject, setPrevSubject] = useState(selectedSubject);
  const [prevTopic, setPrevTopic] = useState(selectedTopic);

  // Reset topics and sub-topics when subject changes
  useEffect(() => {
    if (selectedSubject !== prevSubject) {
      setPrevSubject(selectedSubject);
      setTopics([]);
      setSubTopics([]);

      setValue("topics" as never, "" as never);
      setValue("sub_topics" as never, "" as never);
    }
  }, [selectedSubject, prevSubject, setValue]);

  // Reset sub-topics when topic changes
  useEffect(() => {
    if (selectedTopic !== prevTopic) {
      setPrevTopic(selectedTopic);
      setSubTopics([]);

      setValue("sub_topics" as never, "" as never);
    }
  }, [selectedTopic, prevTopic, setValue]);

  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data))
      .catch(() => setDropdownError("Failed to load subjects"));
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      setTopics([]);
      return;
    }

    let cancelled = false;

    const loadTopics = async () => {
      setTopicsLoading(true);

      try {
        const res = await getTopicsBySubject(selectedSubject);

        if (!cancelled) {
          setTopics(res.data);
        }
      } catch {
        if (!cancelled) {
          setDropdownError("Failed to load topics");
        }
      } finally {
        if (!cancelled) {
          setTopicsLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [selectedSubject]);

  useEffect(() => {
    if (!selectedTopic) {
      setSubTopics([]);
      return;
    }

    let cancelled = false;

    const loadSubTopics = async () => {
      setSubTopicsLoading(true);

      try {
        const res = await getSubTopicsByTopic(selectedTopic);

        if (!cancelled) {
          setSubTopics(res.data);
        }
      } catch {
        if (!cancelled) {
          setDropdownError("Failed to load sub-topics");
        }
      } finally {
        if (!cancelled) {
          setSubTopicsLoading(false);
        }
      }
    };

    loadSubTopics();

    return () => {
      cancelled = true;
    };
  }, [selectedTopic]);

  return {
    subjects,
    topics,
    subTopics,
    topicsLoading,
    subTopicsLoading,
    dropdownError,
  };
}
