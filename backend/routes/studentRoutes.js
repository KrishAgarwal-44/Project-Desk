const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const {
  submitProjectBankForm,
  submitProjectIdeaForm,
  getMyIdeaProject,
  //selectIdeaMentor,
  getMyAssignedProject,
  getProjectBankList,
  getMentorList,
  getDocuments,
  downloadDocument,
  getMyForm3,
  updateForm3Week,
} = require("../controllers/studentController");

router.use(verifyToken, checkRole(["student"]));

router.get("/project-bank", getProjectBankList);
router.post("/submit-bank", submitProjectBankForm);
router.get("/idea-project", getMyIdeaProject);
//router.put("/idea-project/:id/mentor", selectIdeaMentor);
router.get("/assigned-project", getMyAssignedProject);
router.post("/submit-idea", submitProjectIdeaForm);
router.get("/mentors", getMentorList);
router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);
router.get("/form3", getMyForm3);
router.put("/form3/:form3Id/week/:weekNumber",updateForm3Week);

module.exports = router;
