/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
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

  // "Previous" trackers used only to detect a change during render.
  // Plain state is correct here because we read + conditionally set it
  // during render (React explicitly sanctions this pattern).
  const [prevSubject, setPrevSubject] = useState(selectedSubject);
  const [prevTopic, setPrevTopic] = useState(selectedTopic);

  const subjectChanged = selectedSubject !== prevSubject;
  const topicChanged = selectedTopic !== prevTopic;

  if (subjectChanged) {
    setPrevSubject(selectedSubject);
    setTopics([]);
    setSubTopics([]);
  }
  if (topicChanged) {
    setPrevTopic(selectedTopic);
    setSubTopics([]);
  }

  // "Have we run yet" flags, read/written only inside effects — a ref
  // is the right tool here, since we never need them during render.
  const isFirstSubjectSync = useRef(true);
  useEffect(() => {
    if (isFirstSubjectSync.current) {
      isFirstSubjectSync.current = false;
      return;
    }
    setValue("topics" as never, "" as never);
    setValue("sub_topics" as never, "" as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, setValue]);

  const isFirstTopicSync = useRef(true);
  useEffect(() => {
    if (isFirstTopicSync.current) {
      isFirstTopicSync.current = false;
      return;
    }
    setValue("sub_topics" as never, "" as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, setValue]);

  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data))
      .catch(() => setDropdownError("Failed to load subjects"));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;

    let cancelled = false;
    const loadTopics = async () => {
      setTopicsLoading(true);
      try {
        const res = await getTopicsBySubject(selectedSubject);
        if (!cancelled) setTopics(res.data);
      } catch {
        if (!cancelled) setDropdownError("Failed to load topics");
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    };
    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [selectedSubject]);

  useEffect(() => {
    if (!selectedTopic) return;

    let cancelled = false;
    const loadSubTopics = async () => {
      setSubTopicsLoading(true);
      try {
        const res = await getSubTopicsByTopic(selectedTopic);
        if (!cancelled) setSubTopics(res.data);
      } catch {
        if (!cancelled) setDropdownError("Failed to load sub-topics");
      } finally {
        if (!cancelled) setSubTopicsLoading(false);
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
