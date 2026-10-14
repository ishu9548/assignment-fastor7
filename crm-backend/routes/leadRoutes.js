const express = require("express");
const mongoose = require("mongoose");
const Enquiry = require("../models/Enquiry");
const auth = require("../middleware/auth");

const router = express.Router();

// Public enquiry form - no login required
router.post("/enquiries", async (req, res) => {
  try {
    const { name, email, courseInterest } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof courseInterest !== "string" ||
      !courseInterest.trim()
    ) {
      return res.status(400).json({
        message: "Valid name, email, and course interest are required",
      });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      courseInterest: courseInterest.trim(),
    });

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Enquiry error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get all unclaimed public leads
router.get("/leads/unclaimed", auth, async (req, res) => {
  try {
    const leads = await Enquiry.find({ claimedBy: null })
      .sort({ createdAt: -1 });

    return res.json({
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get leads claimed by the logged-in employee
router.get("/leads/my", auth, async (req, res) => {
  try {
    const leads = await Enquiry.find({
      claimedBy: req.employeeId,
    }).sort({ claimedAt: -1 });

    return res.json({
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("My leads error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Claim a lead
router.patch("/leads/:id/claim", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid lead ID",
      });
    }

    // Atomic update: only one counselor can claim the lead
    const lead = await Enquiry.findOneAndUpdate(
      {
        _id: id,
        claimedBy: null,
      },
      {
        $set: {
          claimedBy: req.employeeId,
          claimedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      const exists = await Enquiry.exists({ _id: id });

      if (!exists) {
        return res.status(404).json({
          message: "Lead not found",
        });
      }

      return res.status(409).json({
        message: "This lead has already been claimed",
      });
    }

    return res.json({
      message: "Lead claimed successfully",
      lead,
    });
  } catch (error) {
    console.error("Claim lead error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
