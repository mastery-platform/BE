const Skill = require("../models/skill");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// **CREATE SKILL**
const createSkill = async (req, res) => {
  try {
    const { name, description, estimatedHours } = req.body;

    if (!name || !description || !estimatedHours) {
      // ✅ Ensure estimatedHours is included
      return res.status(400).json({
        message: "Name, description, and estimated hours are required",
      });
    }

    const skill = new Skill({
      user: req.user._id,
      name,
      description,
      estimatedHours,
    });

    await skill.save();
    res.status(201).json(Skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **GET SKILLS (FOR LOGGED-IN USER)**
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **UPDATE Skill**
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, description } = req.body;
    skill.name = name || skill.name;
    skill.description = description || skill.description;

    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **DELETE SKILL**
const deleteSkill = async (req, res) => {
  try {
    console.log("Deleting skill with ID:", req.params.id); // ✅ Debugging

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Skill ID format" });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await skill.deleteOne();
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
};
