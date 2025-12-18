// helper: format date to "DD Mon YYYY • HH:MM AM/PM"
export const formatExamDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month} ${year} • ${time}`;
};

// main converter
export const convertExamSchedules = (response: any) => {
  if (!response?.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map((item: any) => ({
    id: item.schedule_id,
    examId: item.exam_id,
    dateTime: formatExamDateTime(item.exam_date),
    location: item.location,
  }));
};
