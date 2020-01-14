exports.formatDates = list => {
  /* This utility function should be able to take an array (`list`) of objects and return a new array. 
  Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.
   */

  const copyList = [...list];
  const formatDates = copyList.map(obj => {
    const copyObj = { ...obj };
    copyObj.created_at = new Date(copyObj.created_at);
    return copyObj;
  });
  return formatDates;
};

exports.makeRefObj = list => {
  /*
   This utility function should be able to take an array (`list`) of objects and return a reference object. The reference object must be keyed by each item's title, with the values being each item's corresponding id. e.g.
   `[{ article_id: 1, title: 'A' }]`
   will become
   `{ A: 1 }`
  */

  const refObj = {};
  list.forEach(obj => {
    refObj[obj.title] = obj.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  /*
  This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.

  Each formatted comment must have:

  - Its `created_by` property renamed to an `author` key
  - Its `belongs_to` property renamed to an `article_id` key
  - The value of the new `article_id` key must be the id corresponding to the original title value provided
  - Its `created_at` value converted into a javascript date object
  - The rest of the comment's properties must be maintained
  */

  if (articleRef.length === 0) return [];

  const copyComments = [...comments];
  const formatedComments = copyComments.map(comment => {
    const commentCopy = { ...comment };
    commentCopy.author = commentCopy.created_by;
    commentCopy.article_id = articleRef[commentCopy.belongs_to];
    commentCopy.created_at = new Date(commentCopy.created_at);
    delete commentCopy.created_by;
    delete commentCopy.belongs_to;
    return commentCopy;
  });
  return formatedComments;
};
