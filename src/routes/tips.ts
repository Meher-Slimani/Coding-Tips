import { Request, Response, Router } from "express";

import auth from "../middleware/auth";
import Tip from "../entities/Tip";
import Sub from "../entities/Sub";
import Comment from "../entities/Comment";

const createTip = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title === "") {
    return res.status(400).json({ title: "Title must not be empty" });
  }
  try {
    // Find sub
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const tip = new Tip({ title, body, user, sub: subRecord });
    await tip.save();

    return res.json(tip);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getTips = async (_: Request, res: Response) => {
  try {
    const tips = await Tip.find({
      order: {
        createdAt: "DESC",
      },
    });

    return res.json(tips);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getTip = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const tip = await Tip.findOneOrFail(
      { identifier, slug },
      { relations: ["sub"] }
    );

    return res.json(tip);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Tip not found" });
  }
};

const commentOnTip = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;
  try {
    const tip = await Tip.findOneOrFail({ identifier, slug });

    const comment = new Comment({
      body,
      user: res.locals.user,
      tip,
    });

    await comment.save();

    return res.json(comment);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Post not found" });
  }
};

const router = Router();

router.post("/", auth, createTip);
router.get("/", getTips);
router.get("/:identifier/:slug", getTip);
router.post("/:identifier/:slug/comments", auth, commentOnTip);

export default router;
