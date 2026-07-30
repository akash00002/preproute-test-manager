// hooks/useResolvedTestNames.ts
import { useEffect, useMemo } from "react";
import { useMetadataStore } from "../store/metadataStore";

export function useResolvedTestNames(
  subjectId?: string,
  topicIds: string[] = [],
  subTopicIds: string[] = [],
) {
  const subjects = useMetadataStore((s) => s.subjects);
  const topicsBySubject = useMetadataStore((s) => s.topicsBySubject);
  const subTopicsByTopic = useMetadataStore((s) => s.subTopicsByTopic);
  const fetchSubjects = useMetadataStore((s) => s.fetchSubjects);
  const fetchTopics = useMetadataStore((s) => s.fetchTopics);
  const fetchSubTopics = useMetadataStore((s) => s.fetchSubTopics);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (subjectId) fetchTopics(subjectId);
  }, [subjectId, fetchTopics]);

  useEffect(() => {
    topicIds.forEach((topicId) => fetchSubTopics(topicId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(topicIds), fetchSubTopics]);

  const subjectName = useMemo(
    () => subjects.find((s) => s.id === subjectId)?.name ?? "",
    [subjects, subjectId],
  );

  const resolvedTopics = useMemo(() => {
    const list = subjectId ? (topicsBySubject[subjectId] ?? []) : [];
    return list.filter((t) => topicIds.includes(t.id));
  }, [topicsBySubject, subjectId, topicIds]);

  const resolvedSubTopics = useMemo(() => {
    const all = topicIds.flatMap((topicId) => subTopicsByTopic[topicId] ?? []);
    return all.filter((st) => subTopicIds.includes(st.id));
  }, [subTopicsByTopic, topicIds, subTopicIds]);

  return {
    subjectName,
    topics: resolvedTopics, // [{ id, name }]
    subTopics: resolvedSubTopics, // [{ id, name }]
  };
}
