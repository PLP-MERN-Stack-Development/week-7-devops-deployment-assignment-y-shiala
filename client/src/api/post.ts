import API from './api';

export const getAllPosts = () => API.get('/post');

export const getPostById = (id) => API.get(`/post/${id}`);

export const createPost = (postData) => API.post('/post', postData);

export const updatePost = (id, updatedData) => API.put(`/post/${id}`, updatedData);

export const deletePost = (id) => API.delete(`/post/${id}`);
