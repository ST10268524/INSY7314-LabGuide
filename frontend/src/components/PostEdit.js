import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/api';

function PostEdit() {
  const { id } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(res => setContent(res.data.content))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.patch(`/posts/${id}`, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => console.log(res.data))
      .catch(err => console.error(err));
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit">Update Post</button>
    </form>
  );
}

export default PostEdit;
