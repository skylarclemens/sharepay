import './AvatarUpload.scss';
import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { v4 as uuid } from 'uuid';
import Avatar from '../Avatar';
import { useSelector } from 'react-redux';

const AvatarUpload = ({ url, onUpload, type = 'user', className = '' }) => {
  const user = useSelector(state => state.auth.user);
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async e => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuid()}.${fileExtension}`;
      const filePath = `${fileName}`;

      const storageType = type === 'account' ? 'avatars' : 'group-avatars';

      const { data, error } = await supabase.storage
        .from(storageType)
        .upload(`${user?.id}/${filePath}`, file, {
          cacheControl: '604800',
        });
      if (error) throw error;
      onUpload(data.path);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  return (
    <div className={`avatar-input ${className}`}>
      <Avatar url={url} size={60} type={type} />
      <label htmlFor="avatar">Choose image</label>
      <input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  );
};

export default AvatarUpload;
