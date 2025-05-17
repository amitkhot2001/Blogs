import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  return <h2>Viewing Blog #{id}</h2>;
};

export default BlogDetail;
