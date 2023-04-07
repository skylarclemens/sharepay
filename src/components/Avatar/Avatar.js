import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import blankAvatar from '../../images/Blank_avatar.svg';


const Avatar = ({ url, size, classes }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) {
      downloadAvatar(url);
    } else {
      setAvatarUrl(null);
    }
  }, [url]);
  
  const downloadAvatar = async (urlPath) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .getPublicUrl(urlPath);
      if (error) throw error;
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <img
        src={avatarUrl ?? blankAvatar}
        alt={avatarUrl ? 'Blank Avatar Icon' : 'User Avatar'}
        className={`avatar ${classes}`}
        style={{
          height: size,
          width: size
        }} />
    </>
  )
}

export default Avatar;