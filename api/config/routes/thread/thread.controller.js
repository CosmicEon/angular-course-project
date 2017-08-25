const { errors } = require('../../err/');

const controller = (data) => {
  const getThreads = (req, res, next) => {
    const category = req.params.category;
    const perPage = parseInt(req.params.perPage, 10);
    const pageIndex = parseInt(req.params.pageIndex, 10);
    data.thread.getThreads(category, perPage, pageIndex)
      .then((result) => {
        res.status(200)
          .json(result);
      });
  };

  const getThread = (req, res, next) => {
    const id = req.params.threadId;
    data.thread.getThread(id)
      .then((thread) => {
        res.status(200)
          .json(thread);
      })
      .catch((err) => {
        next(err);
      });
  };

  const createThread = (req, res, next) => {
    if (!req.user) {
      return errors.notLoggedIn(next);
    }
    const author = req.user.username;
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    return data.thread.createThread({ author, title, content, category })
      .then((newThread) => {
        res.status(200)
          .json({
            msg: 'Successfuly created thread!',
            result: newThread,
          });
      })
      .catch((err) => {
        next(err);
      });
  };

  const deleteThread = (req, res, next) => {
    if (!req.user) {
      return errors.notLoggedIn(next);
    }
    const username = req.user.username;
    const id = req.params.threadId;
    return data.thread.getThread(id)
      .then((match) => {
        if (!match) {
          return errors.nonExistingThread();
        }
        if (username !== match.author) {
          return errors.notOwner();
        }
        return data.thread.deleteThread(id);
      })
      .then((result) => {
        res.status(200)
          .json({
            msg: 'Successfuly deleted thread!',
            data: result,
          });
      })
      .catch((err) => {
        next(err);
      });
  };

  const createPost = (req, res, next) => {
    if (!req.user) {
      return errors.notLoggedIn(next);
    }
    const author = req.user.username;
    const postData = req.body;
    const threadId = req.params.threadId;
    return data.thread.createPost({ author, threadId, postData })
      .then((result) => {
        res.status(200)
          .json({
            msg: 'Successfuly created post!',
            data: result,
          });
      })
      .catch((err) => {
        next(err);
      });
  };

  const editPost = (req, res, next) => {
    if (!req.user) {
      return errors.notLoggedIn(next);
    }
    const author = req.user.username;
    const threadId = req.params.threadId;
    const postId = parseInt(req.params.postId, 10);
    const newContent = req.body.content;
    return data.thread.editPost({ author, newContent, threadId, postId })
      .then((result) => {
        res.status(200)
          .json({
            msg: 'Successfuly edited post!',
            data: result,
          });
      })
      .catch((err) => {
        next(err);
      });
  };

  const deletePost = (req, res, next) => {
    if (!req.user) {
      return errors.notLoggedIn(next);
    }
    const author = req.user.username;
    const threadId = req.params.threadId;
    const postId = parseInt(req.params.postId, 10);
    return data.thread.deletePost({ author, threadId, postId })
      .then((result) => {
        res.status(200)
          .json({
            msg: 'Successfuly deleted post!',
            data: result,
          });
      })
      .catch((err) => {
        next(err);
      });
  };

  return {
    getThreads,
    getThread,
    createThread,
    deleteThread,
    createPost,
    editPost,
    deletePost,
  };
};

module.exports = controller;
