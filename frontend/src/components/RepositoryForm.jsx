import React, { useState, useEffect, useRef } from 'react';
import repositoryService from '../services/repositoryService';

const RepositoryForm = ({ editMode = false, repoName: initialRepoName = '', repoUrl: initialRepoUrl = '', id = null }) => {
  const [repoName, setRepoName] = useState(initialRepoName);
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [message, setMessage] = useState('');

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSuccess = (msg) => {
    setMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { repoName, repoUrl, visibility };

    if (!editMode) {
      try {
        const res = await repositoryService.create(payload);
        handleSuccess(res.data);
      } catch (err) {
        setMessage('Unable to save repository details');
      }
    } else {
      try {
        const res = await repositoryService.update(id, payload);
        handleSuccess(res.data);
      } catch (err) {
        setMessage('Unable to save repository details');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        placeholder="repoName"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <input
        placeholder="repoUrl"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <select
        aria-label="Visibility"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      >
        <option value="PUBLIC">PUBLIC</option>
        <option value="PRIVATE">PRIVATE</option>
      </select>
      <button type="submit">
        {editMode ? 'Edit Repository' : 'Add Repository'}
      </button>
      {message && <div className="feedback">{message}</div>}
    </form>
  );
};

export default RepositoryForm;