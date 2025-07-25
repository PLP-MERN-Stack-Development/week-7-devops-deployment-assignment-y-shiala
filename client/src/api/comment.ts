import API from './api';

export const getCommentsByPostId = (postId) => API.get(`/comments/post/${postId}`);

export const addComment = (commentData) => API.post('/comments', commentData);

export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);
