const {
  ExamSectionEvaluation,
  User,
  ExamSection,
  ExamSchedule,
} = require("../models");

exports.getExamineeExamResult = async (req, res) => {
  try {
    const { schedule_id, examinee_id } = req.params;

    const result = await ExamSectionEvaluation.findAll({
      where: { schedule_id, examinee_id },

      include: [
        {
          model: ExamSection,
          as: "section",
          attributes: ["section_id", "name", "max_score"],
        },
        {
          model: User,
          as: "examiner",
          attributes: ["user_id", "first_name", "last_name", "role"],
        },
        {
          model: User,
          as: "examinee",
          attributes: ["user_id", "first_name", "last_name"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
          attributes: ["schedule_id", "exam_date", "start_time", "end_time"],
        },
      ],
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        message:
          "No evaluation results found for this examinee in this schedule",
      });
    }

    return res.status(200).json({
      message: "Examinee exam results retrieved",
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      message: "Server error retrieving exam results",
      error: error.message,
    });
  }
};

// retuns total score and average score for an examinee in a schedule

// {
//   "message": "Examinee exam results retrieved",
//   "count": 3,
//   "data": [
//     {
//       "evaluation_id": "...",
//       "raw_score": 8,
//       "calculated_percentage": 80,
//       "section": { "name": "Listening", "max_score": 10 },
//       "examiner": { "first_name": "John", "last_name": "Doe" },
//       "examinee": { "first_name": "Amanuel", "last_name": "Daniel" },
//       "schedule": { "exam_date": "2025-01-03", "start_time": "09:00" }
//     }
//   ]
// }
