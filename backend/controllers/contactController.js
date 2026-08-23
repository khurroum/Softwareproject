const ContactMessage = require("../models/ContactMessage");

// ==================================================
// CREATE CONTACT MESSAGE
// ==================================================

const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message:
          "Please provide name, email, subject, and message.",
      });
    }

    // =========================
    // CREATE MESSAGE
    // =========================

    const contactMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      });

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({
      message:
        "Your message has been sent successfully.",
      contactMessage,
    });
  } catch (error) {
    console.error(
      "Create contact message error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to send your message.",
      error: error.message,
    });
  }
};


// ==================================================
// ADMIN: GET ALL CONTACT MESSAGES
// ==================================================

const getAllContactMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await ContactMessage.find()
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(
      "Get contact messages error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load contact messages.",
      error: error.message,
    });
  }
};


// ==================================================
// ADMIN: UPDATE MESSAGE STATUS
// ==================================================

const updateContactMessageStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "New",
      "Read",
      "Replied",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid message status.",
      });
    }

    const contactMessage =
      await ContactMessage.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!contactMessage) {
      return res.status(404).json({
        message:
          "Contact message not found.",
      });
    }

    res.status(200).json({
      message:
        "Message status updated successfully.",
      contactMessage,
    });
  } catch (error) {
    console.error(
      "Update contact message status error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update message status.",
      error: error.message,
    });
  }
};


// ==================================================
// ADMIN: DELETE CONTACT MESSAGE
// ==================================================

const deleteContactMessage = async (
  req,
  res
) => {
  try {
    const contactMessage =
      await ContactMessage.findByIdAndDelete(
        req.params.id
      );

    if (!contactMessage) {
      return res.status(404).json({
        message:
          "Contact message not found.",
      });
    }

    res.status(200).json({
      message:
        "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete contact message error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete contact message.",
      error: error.message,
    });
  }
};


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};