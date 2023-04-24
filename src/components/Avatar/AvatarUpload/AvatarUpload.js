import './AvatarUpload.scss';
import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { v4 as uuid } from 'uuid';
import Avatar from '../Avatar';
import { useSelector } from 'react-redux';

const AvatarUpload = ({ url, onUpload }) => {
  const user = useSelector(state => state.user);
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

      const { data, error } = await supabase.storage
        .from('avatars')
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
    <div className="avatar-input">
      <label className="input-label" htmlFor="avatar">
        Avatar
      </label>
      <div className="img-input">
        <Avatar url={url} size={60} />
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
