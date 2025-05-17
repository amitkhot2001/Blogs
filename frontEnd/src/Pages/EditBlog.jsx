import React from 'react';
import { useParams } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams();
  return <h2>Edit Blog #{id}</h2>;
};

export default EditBlog;
