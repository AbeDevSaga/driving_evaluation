const { ExamSection, Exam, User, ExamSectionExaminer } = require("../models");

// ===============================
// CREATE EXAM SECTION
// ===============================
exports.createExamSection = async (req, res) => {
  try {
    const { exam_id, name, description, weight } = req.body;

    // Validate 0–100 weight
    if (weight < 0 || weight > 100) {
      return res.status(400).json({ message: "Weight must be between 0-100." });
    }

    const section = await ExamSection.create({
      exam_id,
      name,
      description,
      weight,
    });

    return res.status(201).json(section);
  } catch (error) {
    console.error("Error creating exam section:", error);
    return res
      .status(500)
      .json({ error: "Server error creating exam section." });
  }
};

// ===============================
// GET ALL SECTIONS
// ===============================
exports.getAllExamSections = async (req, res) => {
  try {
    const sections = await ExamSection.findAll({
      include: [
        {
          model: Exam,
          as: "exam",
        },
        {
          model: User,
          as: "assignedExaminers",
          through: { attributes: [] },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(sections);
  } catch (error) {
    console.error("Error fetching exam sections:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching exam sections." });
  }
};

// ===============================
// GET ONE SECTION
// ===============================
exports.getExamSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await ExamSection.findByPk(id, {
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "assignedExaminers", through: { attributes: [] } },
      ],
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }

    return res.status(200).json(section);
  } catch (error) {
    console.error("Error fetching section:", error);
    return res.status(500).json({ error: "Server error fetching section." });
  }
};

// ===============================
// UPDATE SECTION
// ===============================
exports.updateExamSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, weight } = req.body;

    const section = await ExamSection.findByPk(id);
    if (!section)
      return res.status(404).json({ message: "Section not found." });

    if (weight && (weight < 0 || weight > 100)) {
      return res.status(400).json({ message: "Weight must be between 0–100." });
    }

    await section.update({
      name,
      description,
      weight,
    });

    return res.status(200).json(section);
  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({ error: "Server error updating section." });
  }
};

// ===============================
// DELETE (SOFT DELETE)
// ===============================
exports.deleteExamSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await ExamSection.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }

    await section.destroy();

    return res.status(200).json({ message: "Section deleted successfully." });
  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({ error: "Server error deleting section." });
  }
};

// ===============================
// ASSIGN EXAMINER TO SECTION
// ===============================
exports.assignExaminerToSection = async (req, res) => {
  try {
    const { section_id, examiner_id } = req.body;

    // Check if already assigned
    const existing = await ExamSectionExaminer.findOne({
      where: { section_id, examiner_id },
    });

    if (existing) {
      return res.status(400).json({ message: "Examiner already assigned." });
    }

    const assignment = await ExamSectionExaminer.create({
      section_id,
      examiner_id,
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error("Error assigning examiner:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

// ===============================
// REMOVE EXAMINER FROM SECTION
// ===============================
exports.removeExaminerFromSection = async (req, res) => {
  try {
    const { section_id, examiner_id } = req.body;

    const assignment = await ExamSectionExaminer.findOne({
      where: { section_id, examiner_id },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    await assignment.destroy();

    return res.status(200).json({ message: "Examiner removed successfully." });
  } catch (error) {
    console.error("Error removing examiner:", error);
    return res.status(500).json({ error: "Server error." });
  }
};
