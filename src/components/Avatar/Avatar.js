import './Avatar.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { v4 as uuid } from 'uuid';
import blankAvatar from '../../images/Blank_avatar.svg';
import { setAccountData } from '../../slices/accountSlice';


const Avatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (url) downloadAvatar(url);
  }, [url]);

  const uploadAvatar = async (e) => {
    try {
      setUploading(true);

      if(!e.target.files || e.target.files.length === 0) {
        throw new Error('Select an image to upload.')
      }

      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuid()}.${fileExtension}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file);

      console.log(data);

      /*const newAccount = {
        ...account.data,
        avatar_url: file
      }*/

      if (error) throw error;
      
      onUpload(e, filePath);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  }
  
  const downloadAvatar = async (urlPath) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .download(urlPath);
      if (error) throw error;

      const imgUrl = URL.createObjectURL(data);
      setAvatarUrl(imgUrl);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="avatar-input">
      <label className="input-label" htmlFor="avatar">Avatar</label>
      <div className="img-input">
        <img src={avatarUrl ? avatarUrl : blankAvatar} alt={avatarUrl ? 'Blank Avatar Icon' : 'User Avatar'} className="avatar" />
        <input id="avatar" name="avatar" type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
      </div>
    </div>
  )
}

export default Avatar;