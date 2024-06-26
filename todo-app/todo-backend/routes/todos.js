const express = require("express");
const { Todo } = require("../mongo");
const redis = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  let counter = await redis.getAsync("added_todos");

  if (!counter) {
    await redis.setAsync("added_todos", 0);
    counter = 0;
  }

  await redis.setAsync("added_todos", parseInt(counter) + 1);

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  const todo = await Todo.findById(req.todo._id);
  res.send(todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const todo = req.todo;
  const { text, done } = req.body;

  if (typeof text === "string") todo.text = text;
  if (typeof done === "boolean") todo.done = done;

  await todo.save();

  res.send(todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
