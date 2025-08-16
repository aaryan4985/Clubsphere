const jwt = require("jsonwebtoken");
const { getDbConnection } = require("../database/init");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

const requireClubLeader = async (req, res, next) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.id || req.body.club_id;

    if (!clubId) {
      return res.status(400).json({ message: "Club ID required" });
    }

    db.get(
      "SELECT leader_id FROM clubs WHERE id = ?",
      [clubId],
      (err, club) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!club) {
          return res.status(404).json({ message: "Club not found" });
        }

        if (club.leader_id !== req.user.id) {
          return res
            .status(403)
            .json({ message: "Only club leaders can perform this action" });
        }

        next();
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const requireClubMember = async (req, res, next) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.id || req.body.club_id;

    if (!clubId) {
      return res.status(400).json({ message: "Club ID required" });
    }

    db.get(
      `SELECT cm.*, c.leader_id 
       FROM club_members cm 
       JOIN clubs c ON cm.club_id = c.id 
       WHERE cm.club_id = ? AND cm.user_id = ?`,
      [clubId, req.user.id],
      (err, membership) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!membership) {
          return res
            .status(403)
            .json({ message: "You must be a member of this club" });
        }

        req.membership = membership;
        req.isLeader = membership.leader_id === req.user.id;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  authenticateToken,
  requireClubLeader,
  requireClubMember,
};
