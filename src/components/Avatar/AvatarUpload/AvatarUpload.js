import './AvatarUpload.scss';
import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { useUpdateAccountMutation } from '../../../slices/accountSlice';
import { Camera } from '../../Icons';

const AvatarUpload = ({ onUpload, type = 'user', className = '', ...props }) => {
  const user = useSelector(state => state.auth.user);
  const [uploading, setUploading] = useState(false);
  const updateAccount = useUpdateAccountMutation();

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
      if(type === 'user') updateUserAvatar(data.path);
      if(type === 'group') onUpload(data.path);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  const updateUserAvatar = async (path) => {
    try {
      const updates = {
        id: user.id,
        avatar_url: path,
        updated_at: new Date(),
      };

      await updateAccount(updates).unwrap();
      onUpload(path);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`avatar-upload ${className}`} {...props}>
      <label htmlFor="avatar-upload">
        Upload new avatar
        <div className="avatar-camera">
          <Camera fill="#787878" />
        </div>
      </label>
      <input
        id="avatar-upload"
        name="avatar-upload"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  );
};

export default AvatarUpload;
