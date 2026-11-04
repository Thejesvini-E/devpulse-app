import React, { useState, useEffect, useRef } from 'react';
import repositoryService from '../services/repositoryService';
import RepositoryForm from './RepositoryForm';

const RepositoryList = ({ isAdmin = false }) => {
  const [repositories, setRepositories] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    repositoryService.getAll()
      .then((res) => {
        setRepositories(res.data || []);
      })
      .catch(() => {
        setRepositories([]);
      });
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handleDelete = async (id) => {
    try {
      const res = await repositoryService.remove(id);
      setMessage(res.data);
      setRepositories((prev) => prev.filter((repo) => repo.id !== id));
    } catch (err) {
      // Handle error gracefully
    }
  };

  return (
    <div>
      {message && <div className="success-msg">{message}</div>}
      
      {isAdmin && (
        <button onClick={handleAddClick}>Add Repository</button>
      )}

      {showModal && (
        <div ref={modalRef} className="modal-container">
          <RepositoryForm editMode={false} />
        </div>
      )}

      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            <span>{repo.repoName}</span>
            <span>{repo.repoUrl}</span>
            <button onClick={() => handleDelete(repo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepositoryList;