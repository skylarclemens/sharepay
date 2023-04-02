import './Avatar.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import blankAvatar from '../../images/Blank_avatar.svg';


const Avatar = ({ url, size }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) downloadAvatar(url);
  }, [url]);
  
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
    <>
      <img
        src={avatarUrl ? avatarUrl : blankAvatar}
        alt={avatarUrl ? 'Blank Avatar Icon' : 'User Avatar'}
        className="avatar"
        style={{
          height: size,
          width: size
        }} />
    </>
  )
}

export default Avatar;